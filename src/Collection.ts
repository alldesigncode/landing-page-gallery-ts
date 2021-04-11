import { iconChevronRight } from "./utils/data";
import { domUtils } from "./utils/utils";
import { gsap, Expo } from "gsap";
import { CollectionImage } from "./state";
import { isArray } from "lodash";
import { InfiniteSlider } from "./InfiniteSlider";

export const constants = {
  COLLECTION_ELEMENT_WIDTH: 300,
  COLLECTION_ELEMENT_PADDING: 40,
  DEFAULT_ITEM_COUNT: 3
}

class CollectionView extends InfiniteSlider {
  progress = 0;
  tl = gsap.timeline();

  // DOM elements map
  public elements = new Map([
    ["showcase", domUtils.get(".showcase")],
    ["bottom-left", domUtils.get(".bottom-left")]
  ]);

  constructor() {
    super();
    this.init();

    this.progressIndexChange.subscribe((_) => {
      this.toggleActive();
      this.updateProgress();
    })
    this.indexChange.subscribe((_) => this.enableButton())
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
    this.collectionLength = data.length;
    data.map((d, i) => this.displayCollection(d, this.elements.get("collection"), i));
    const containerCollection =
      this.elements.get("collection") &&
      this.elements.get("collection").children;
    if (containerCollection && containerCollection.length) {
      this.calculateWidth();
      this.createActions();
      this.initListeners();
      this.itemsShown();
      gsap.to(containerCollection, {
          autoAlpha: 1,
          stagger: 0.15,
          duration: 0.5,
          ease: Expo.easeInOut as any,
        });
        setTimeout(() => this.toggleActive(), 200);
    }
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
    this.slide({ collection: this.collection, elemPadding: 40, verticalTranslatePosition: 25 })
  }

  private disableButton = () => (this.elements.get('next') as HTMLButtonElement).disabled = true;
  private enableButton = () => (this.elements.get('next') as HTMLButtonElement).disabled = false;

  private toggleActive(): void {
    this.collection.map((col, index) => {
      if (this.progressIndex === index) col.classList.add('active');
      else col.classList.remove('active');
    })
  }

  private updateProgress(): void {
    this.progress = this.progressIndex * 100 / (this.collection.length - 1);
    gsap.to(this.elements.get('progress'), {
      width: `${this.progress}%`,
      duration: 0.5,
    });
    this.elements.get('bottom-left').querySelector('.count').textContent = `${this.progressIndex + 1}`.padStart(2, "0");
  }
  
  public onImgSelect(event: any, img: any): void {}

  public displayCollection(data: CollectionImage, collectionContainer: HTMLElement, index): void {
    const fig = domUtils.create("figure"), img = domUtils.create("img") as HTMLImageElement;
    img.src = data.urls.regular;

    fig.classList.add("collection-img");
    fig.style.transform = `translate(0px, -${25 * index}px)`;
    fig.style.opacity = '0';
    fig.style.visibility = 'hidden';
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
