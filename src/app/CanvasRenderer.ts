import {DomRootRenderer, DomRenderer} from "@angular/platform-browser/src/dom/dom_renderer";
import {EventManager, AnimationDriver} from "@angular/platform-browser";
import {DomSharedStylesHost} from "@angular/platform-browser/src/dom/shared_styles_host";
import {Renderer, RenderComponentType, Injectable} from "@angular/core";

@Injectable()
export class CanvasRootRenderer extends DomRootRenderer {

  constructor(eventManager:EventManager, sharedStylesHost:DomSharedStylesHost, animate:AnimationDriver) {
    super(document, eventManager, sharedStylesHost, animate);
  }

  renderComponent(componentProto:RenderComponentType):Renderer {
    return new CanvasRenderer(this, componentProto, this.animationDriver);
  }

}

class CanvasRenderer extends DomRenderer {

  private y:number = 0;
  private width:number;
  private canvas:any;

  constructor(rootRenderer:CanvasRootRenderer, componentProto:RenderComponentType, animationDriver:AnimationDriver) {
    super(rootRenderer, componentProto, animationDriver);
  }

  get ctx() {
    return this.canvas.getContext('2d');
  }

  createElement(parent:Element, name:string):Node {
    console.log("create element:", arguments)
    // return super['createElement'].apply(this, arguments);
    this.ctx.strokeRect(0, this.y, this.width, 50);
    this.ctx.font = '30px Monospace';
    this.ctx.fillText(name, 20, this.y + 25);
    this.y += 50;
    return <Node>{
      setAttribute: function () {
        console.log("setting attribute:", arguments);
      },
      appendChild:()=>{}
    };
  }

  createViewRoot(hostElement:any) {
    console.log("create view root:", arguments)
    // return super['createViewRoot'].apply(this, arguments);
    this.canvas = document.createElement('canvas');
    this.canvas.height = 500;
    this.canvas.width = document.body.offsetWidth;
    this.width = document.body.offsetWidth;
    hostElement.appendChild(this.canvas);
  }

  createText(parentElement:any, value:string):any {
    console.log("create text:", arguments)
    return super['createText'].apply(this, arguments);
  }

  setText(renderNode:any, text:string):void {
    console.log("set text:", arguments)
    super['setText'].apply(this, arguments);
  }

  attachViewAfter(node:any, viewRootNodes:any[]) {
    console.log("attach view after:", arguments)
    return super['attachViewAfter'].apply(this, arguments);
  }
}


