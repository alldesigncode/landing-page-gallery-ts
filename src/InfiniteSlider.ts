import { gsap, Expo } from "gsap";
import { Subject } from "rxjs";

/**
 * One-way (or unidirectional) infinite slider that works with any data.
 * It uses gsap for element translation.
 *
 * Note - Currenlty supports sliding elements from right to left.
 */
export class InfiniteSlider {
  public collectionLength: number;

  /**
   * Active slide index
   */
  public activeIndex = 0;

  /**
   * Additional progrss index that switches faster than activeIndex
   */
  public progressIndex = 0;

  public indexChange = new Subject<number>();
  public progressIndexChange = new Subject<number>();

  constructor() {}

  /**
   *
   * @param collection Collection array to manipulate.
   * @param elemPadding
   * @param elemMargin
   * @param verticalTranslatePosition
   * @param ease - (Optional param) Easing property. By default it uses Expo.easeInOut
   * @param duration - (Optional param) Slide duration. By default it uses 1 second.
   */
  public slide({ collection = [], elemPadding = 0, elemMargin = 0, verticalTranslatePosition = 0, ease = Expo.easeInOut as any, duration = 1}: SlideParams) {
    this.increaseProgressIndex();
    collection.map((element, index) => {
      const [x, y] = gsap.getProperty(element, "transform").toString().match(/[0-9\,\-]/g).join('').split(','); // match only numbers, commas and dashes.
      const propX = Number(x), propY = Number(y);
      const propWidth = Number(gsap.getProperty(element, "width")) + elemPadding + elemMargin;
      const propXPos = Math.abs(propX);
      if (propX > 0) {
        gsap.to(element, {
          transform: `translate3d(${propX - propWidth}px, ${propY + verticalTranslatePosition}px, 0)`,
          duration,
          ease
        });
      } else {
        gsap.to(element, {
            transform: `translate3d(${-(propXPos + propWidth)}px, ${propY + verticalTranslatePosition}px, 0)`,
            ease,
            duration
          }).then(() => this.resetBackwards({collection, propWidth, index}));
      }
    });
  }

  public resetBackwards({ collection, propWidth, index }) {
    if (this.activeIndex === index) {
      gsap
      .to(collection[this.activeIndex], {
        duration: 0,
        x: propWidth * (collection.length - 1 - this.activeIndex),
        y: -(25 * collection.length - 25)
      })
      .then(() => setTimeout(() => this.increaseIndex()));
    }
  }

  private increaseIndex(): void {
    this.activeIndex = (this.activeIndex + 1) % this.collectionLength;
    this.indexChange.next(this.activeIndex);
  }

  private increaseProgressIndex(): void {
    this.progressIndex = (this.progressIndex + 1) % this.collectionLength;
    this.progressIndexChange.next(this.progressIndex);
  }
}

export interface SlideParams {
  collection: any[];
  verticalTranslatePosition?: number;
  elemPadding?: number;
  elemMargin?: number;
  duration?: number;
  ease?: any;
}

export interface TranslateParams {
  element: any;
  x: number;
  y: number;
  ease?: any;
  duration?: number;
  collection?: any[];
  propWidth?: number;
  index?: number;
}
