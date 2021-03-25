import { gsap, Expo } from "gsap";
import { isFunction } from "lodash";

/**
 * One-way (or unidirectional) infinite slider that works with any data.
 * It uses gsap for element translation.
 * 
 * Note - Currenlty supports sliding elements from right to left.
 */
export class InfiniteSlider {
    /**
     * Active slide index
     */
    public activeIndex = 0;

    /**
     * Additional progrss index that switches faster than activeIndex
     */
    public progressIndex = 0;

    /**
     * 
     * @param collection Collection array to manipulate.
     * @param padding
     * @param margin
     * @param verticalTranslatePosition
     * @param ease - (Optional param) Easing property. By default it uses Expo.easeInOut
     * @param duration - (Optional param) Slide duration. By default it uses 1 second.
     * @param callbackFn - (Optional param) Callback function to fire after step index has changed.
     */
    public slide({collection = [], padding = 0, margin = 0, verticalTranslatePosition = 0, duration = 1, ease = Expo.easeInOut as any, callbackFn}: SlideParams) {
        collection.forEach((element, index) => {
            const propX = Number(gsap.getProperty(element, "translateX"));
            const propY = Number(gsap.getProperty(element, "translateY"));
            const propWidth = Number(gsap.getProperty(element, "width")) + padding + margin;
            const propXPos = Math.abs(propX);
      
            if (propX > 0) {
            //   this.translate({ element, x: propX - propWidth, y: propY + verticalTranslatePosition, ease, duration });
            } else {
            //   this.translate({ element, x: -(propXPos + propWidth), y: propY + verticalTranslatePosition, ease, duration, callbackFn: this.resetBackwards})
            }
          });
    }

    // TODO - fix these
    // private translate({element, x = 0, y = 0, duration = 1, ease = Expo.easeInOut as any, collection, propWidth, index, callbackFn}: TranslateParams): void {
    //     gsap.to(element, {transform: `translate3d(${y}px, ${y}px, 0)`, duration, ease,}).then(() => isFunction(callbackFn) && callbackFn({collection, propWidth, index}));
    // }

    // private resetBackwards({collection, propWidth, index}): void {
    //     if (this.activeIndex === index) {
    //         this.translate({ element: collection[this.activeIndex], duration: 0, x: propWidth * (collection.length - 1 - this.activeIndex), y: -(25 * collection.length - 25), })
    //         // .then(() => setTimeout(() => this.increaseIndex()));
    //       }
    // }

}

export interface SlideParams {
    collection: any[];
    verticalTranslatePosition?: number;
    padding?: number;
    margin?: number;
    duration?: number;
    ease?: any
    callbackFn?: ({}: any) => void;
}

export interface TranslateParams {
    element: any
    x: number;
    y: number;
    ease?: any, 
    duration?: number;
    callbackFn?: ({}: any) => void;

    collection?: any[];
    propWidth?: number;
    index?: number;
}