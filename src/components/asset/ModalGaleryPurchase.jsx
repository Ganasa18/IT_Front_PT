import React, { useState } from "react";
import "./modal_galery.css";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { prEndPoint } from "../../assets/menu";
import Loading from "./Loading";

const ModalGaleryPurchase = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);

  //   const images = [
  //     {
  //       original: "https://picsum.photos/id/1018/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1018/250/150/",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1015/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1015/250/150/",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1019/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1019/250/150/",
  //     },
  //   ];

  React.useEffect(() => {
    getImgList();
  }, []);

  const getImgList = () => {
    console.log(props.imgList);

    let imgNew = props.imgList.map((item) => ({
      original:
        `${prEndPoint[0].url}${
          prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
        }` +
        `/public/image/purchase/` +
        `${item.img_name.split(".").slice(0, -1).join(".")}${".jpeg"}`,
      thumbnail:
        `${prEndPoint[0].url}${
          prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
        }` +
        `/public/image/purchase/` +
        `${item.img_name.split(".").slice(0, -1).join(".")}${".jpeg"}`,
    }));
    setImages(imgNew);
    setIsLoading(false);
  };

  if (!props.show) {
    return null;
  }

  //   if (isLoading) {
  //     return <Loading />;
  //   }
  return (
    <div
      className={`modal ${props.show ? "show" : ""}`}
      onClick={props.onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"></div>
        <div className="modal-body">
          <ImageGallery
            items={images}
            showFullscreenButton={false}
            showPlayButton={false}
            thumbnailPosition={"right"}
          />
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
};

export default ModalGaleryPurchase;
