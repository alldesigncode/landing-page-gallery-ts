import { data, iconChevronRight } from "./utils/data";
import { domUtils } from "./utils/utils";
import { gsap, Expo } from "gsap";
import { CollectionImage } from "./state";
import { isArray } from "lodash";

export const constants = {
  COLLECTION_ELEMENT_WIDTH: 300,
  COLLECTION_ELEMENT_PADDING: 40,
  DEFAULT_ITEM_COUNT: 3
}

class CollectionView {
  progress = 0;
  activeIndex = 0;
  imageList = data;
  tl = gsap.timeline();
  defaultEase = Expo.easeInOut as any;

  // DOM elements map
  public elements = new Map([
    ["showcase", domUtils.get(".showcase")], // parent element
  ]);

  constructor() {
    this.init();
  }

  public init() {
    this.createCollection()
  }

  public get collection(): HTMLElement[] {
    const { get, toArray } = domUtils;
    const collection = toArray(get(".collection").children);

    return isArray(collection) && collection.length && collection;
  }

  public renderCollection(data: CollectionImage[]): void {
    data.map((d, i) => this.displayCollection(d, this.elements.get('collection'), i))
    this.createActions()
    this.calculateWidth()
    this.itemsShown();
    this.toggleActive();
    this.initListeners();
  }

  private createCollection(): void {
    const collectionElement = domUtils.create("div");
    collectionElement.classList.add("collection");
    this.elements.get("showcase").appendChild(collectionElement);
    this.elements.set("collection", collectionElement);
  }

  /**
   * Adds calculated width to collection container based on item length.
   */
  private calculateWidth() {
    const { COLLECTION_ELEMENT_PADDING, COLLECTION_ELEMENT_WIDTH } = constants;
    const calculatedWidth = (COLLECTION_ELEMENT_WIDTH + COLLECTION_ELEMENT_PADDING) * this.collection.length;
    this.elements.get('collection').style.width = `${calculatedWidth}px`;
    return this;
  }

  /**
   * @param itemCount - How many items to show on screen. Select between 1-3
   */
  private itemsShown(itemCount = constants.DEFAULT_ITEM_COUNT) {
    const { COLLECTION_ELEMENT_PADDING, COLLECTION_ELEMENT_WIDTH } = constants;
    const calculatedWidth = (COLLECTION_ELEMENT_WIDTH + COLLECTION_ELEMENT_PADDING) * (itemCount > 3 ? constants.DEFAULT_ITEM_COUNT : itemCount);
    this.elements.get('showcase').style.width = `${calculatedWidth}px`;
  }

  private initListeners(): void {
    this.collection.forEach((collectionImg, index) =>
      collectionImg.addEventListener("click", (event) => this.onImgSelect(event, collectionImg))
    );
    this.elements.get("next").addEventListener("click", this.onNext.bind(this));
  }

  private createActions(): void {
    const actionsContainer = domUtils.create("div"), 
          buttonNext = domUtils.create("button"),
          progress = domUtils.create("div"),
          progressLine = domUtils.create("div");

    buttonNext.innerHTML = iconChevronRight;
    progressLine.classList.add('progress-line');
    progress.appendChild(progressLine);

    actionsContainer.classList.add('collection-actions');
    progress.classList.add('progress');
    buttonNext.classList.add("next");
    actionsContainer.appendChild(buttonNext);
    actionsContainer.appendChild(progress);
    this.elements.get("showcase").insertAdjacentElement("beforeend", actionsContainer);

    // save created buttons to elements map
    this.elements.set("next", domUtils.get("button.next"));
    this.elements.set("progress", domUtils.get("div.progress-line"));
    this.elements.set("actions", domUtils.get("div.collection-actions"));
  }

  public onNext(): void {
    this.disableButton();
    this.collection.forEach((col, index) => {
      const propX = Number(gsap.getProperty(col, "translateX"));
      const propY = Number(gsap.getProperty(col, "translateY"));
      const propWidth = Number(gsap.getProperty(col, "width")) + 40;

      const propXPos = Math.abs(propX);

      if (propX > 0) {
        gsap.to(col, {
          transform: `translate3d(${propX - propWidth}px, ${propY + 25}px, 0)`,
          duration: 1,
          ease: this.defaultEase
        });
      } else {
        gsap.to(col, {
            transform: `translate3d(${-(propXPos + propWidth)}px, ${propY + 25}px, 0)`,
            ease: this.defaultEase,
            duration: 1,
          }).then(() => this.resetBackwards(propWidth, index));
      }
    });
  }

  private resetBackwards(propWidth: number, index): void {
    if (this.activeIndex === index) {
      gsap
      .to(this.collection[this.activeIndex], {
        duration: 0,
        x: propWidth * (this.collection.length - 1 - this.activeIndex),
        y: -(25 * this.collection.length - 25)
      })
      .then(() => setTimeout(() => this.increaseIndex()));
    }
  }

  private disableButton = () => (this.elements.get('next') as HTMLButtonElement).disabled = true;
  private enableButton = () => (this.elements.get('next') as HTMLButtonElement).disabled = false;

  private increaseIndex(): void {
    this.activeIndex = (this.activeIndex + 1) % this.collection.length;
    this.toggleActive();
    this.updateProgress();
    this.enableButton();
  }

  private toggleActive(): void {
    this.collection.map((col, index) => {
      if (this.activeIndex === index) col.classList.add('active');
      else col.classList.remove('active');
    })
  }

  private updateProgress(): void {
    this.progress = this.activeIndex * 100 / (this.collection.length - 1);
    gsap.to(this.elements.get('progress'), {
      width: `${this.progress}%`,
      duration: 0.5,
    })
  }
  public onImgSelect(event: any, img: any): void {}

  public displayCollection(data: CollectionImage, collectionContainer: HTMLElement, index): void {
    const fig = domUtils.create("figure"), img = domUtils.create("img") as HTMLImageElement;
    img.src = data.urls.regular;

    fig.classList.add("collection-img");
    fig.style.transform = `translate3d(0px, -${25 * index}px, 0px)`;
    fig.innerHTML = `
      <div class="fig-info">
        <div class="fig-count">${index + 1}</div>
        <div class="fig-line"></div>
        <div class="fig-author">${data.user.name}</div>
      </div>
      <div class="overlay"></div>
    `;
    fig.appendChild(img);

    collectionContainer.appendChild(fig);
  }
}

export default new CollectionView();
