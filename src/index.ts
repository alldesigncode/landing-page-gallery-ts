import "../sass/main.scss";
import { collectionState } from "./state";
import { getPhotos } from "./utils/api";
import collectionView from './Collection';
import { isArray } from "lodash";

const CollectionController = async () => {
  try {
    const { data = [] } = await getPhotos(11);

    if (isArray(data) && data.length) {
      collectionState.data = data;
      collectionView.renderCollection(collectionState.data);
    }
  } catch (error) {
    console.error(error);
  }
};

const init = () => {
  window.addEventListener("load", () => CollectionController());
};

init();
