import {Injectable, Inject, Renderer, RenderComponentType} from "@angular/core";
import {DOCUMENT, EventManager, AnimationDriver} from "@angular/platform-browser";
import {DomRootRenderer, DomRenderer} from "@angular/platform-browser/src/dom/dom_renderer";
import {DomSharedStylesHost} from "@angular/platform-browser/src/dom/shared_styles_host";
import {isBlank, isPresent} from "@angular/core/src/facade/lang";
@Injectable()
export class CanvasRootRenderer2 extends DomRootRenderer {
  constructor(@Inject(DOCUMENT) _document:any, _eventManager:EventManager,
              sharedStylesHost:DomSharedStylesHost, animate:AnimationDriver) {
    super(_document, _eventManager, sharedStylesHost, animate);
  }

  renderComponent(componentProto:RenderComponentType):Renderer {
    console.log("this:",this);
    var renderer = this.registeredComponents.get(componentProto.id);
    if (isBlank(renderer)) {
      renderer = new CanvasRenderer(this, componentProto, this.animationDriver);
      this.registeredComponents.set(componentProto.id, renderer);
    }
    return renderer;
  }
}

class CanvasContainer {
  elm:HTMLElement;
  x:number = 0;
  y:number = 0;
  width:number = 0;
  height:number = 0;
  marginX:number = 30;
  marginY:number = 30;

  nodeTree = new Map<Node, number>();
  instructions = [];
  drawId:number = 0;

  constructor(parent) {
    this.elm = document.createElement('canvas');
    parent.appendChild(this.elm);
    this.width = this.elm.offsetWidth;
    this.height = this.elm.offsetHeight;
    this.elm.setAttribute('width', this.width + 'px');
    this.elm.setAttribute('height', this.height + 'px');
    this.y += this.marginY;

    this.nodeTree[parent] = 0;
  }

  get ctx() {
    return this.elm['getContext']('2d');
  }

  renderElement(element, parent) {
    var exists = !!this.nodeTree.get(element);
    var count = this.nodeTree.get(parent) || 0;
    count++;
    this.nodeTree.set(element, count);
    if (exists) return;
    this.instructions.push(element);
    if (this.drawId) {
      window.cancelAnimationFrame(this.drawId);
    }
    this.drawId = window.requestAnimationFrame(() => this.draw());
  }

  draw() {
    this.instructions.forEach((elm) => {
      if (elm.nodeType == 3) {
        if (elm.nodeValue.trim().length == 0) return;
      }

      var name = this.generateNodeName(elm);
      var count = this.nodeTree.get(elm) || 0;
      var height = 40;
      var margin = count * this.marginX;
      var x = margin + this.x;
      this.ctx.strokeRect(x, this.y, this.width - margin - this.marginX, height);
      this.ctx.font = "30px Monospace";
      this.ctx.fillText(name, x + 20, this.y + (height * 0.66));
      this.y += height;
    });
  }

  generateNodeName(element) {
    if (element.nodeType == 1) {
      var name = element.nodeName.toLowerCase();
      if (element.className) {
        name += '.' + element.className;
      }
      return '<' + name + '>';
    }
    return element.nodeName + ': ' + element.nodeValue.trim();
  }

  getElement() {
    return this.elm;
  }
}

class CanvasRenderer extends DomRenderer {
  private canvas:CanvasContainer;
  private tempSiblingMap = new Map<Node, Node>();

  constructor(_rootRenderer:CanvasRootRenderer2, componentProto:RenderComponentType, animationDriver:AnimationDriver) {
    super(_rootRenderer, componentProto, animationDriver);
  }

  createElement(parent:Element, name:string):Node {
    // var elm = super.createElement(null, name);
    var elm = super['createElement'].apply(this, arguments);
    this.canvas.renderElement(elm, parent);
    return elm;
  }

  createViewRoot(hostElement:any):any {
    this.canvas = new CanvasContainer(hostElement);
    return super.createViewRoot(hostElement);
  }

  createText(parentElement:any, value:string):any {
    var node = document.createTextNode(value);
    if (isPresent(parentElement)) {
      parentElement.appendChild(node);
      this.canvas.renderElement(node, parentElement);
    }
    return node;
  }

  setText(renderNode:any, text:string):void {
    renderNode.nodeValue = text;
    if (text.length > 0) {
      this.canvas.renderElement(renderNode, renderNode.parentElement);
    }
  }

  attachViewAfter(node:any, viewRootNodes:any[]) {
    var parent;
    if (node.nodeType == 1) {
      parent = this.tempSiblingMap.get(node);
    } else {
      parent = node.parentNode;
    }

    for (let i = 0; i < viewRootNodes.length; i++) {
      let n = viewRootNodes[i];
      this.tempSiblingMap.set(n, parent);
      this.canvas.renderElement(n, parent);
    }
  }
}
