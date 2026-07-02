export type VideoSource = {
  src: string;
  type: string;
};

type MainSlideBase = {
  id: string;
  title: string;
  description: string;
};

export type MainVideoSlide = MainSlideBase & {
  type: "video";
  sources: VideoSource[];
  poster?: string;
};

export type MainImageSlide = MainSlideBase & {
  type: "image";
  src: string;
  alt?: string;
};

export type MainSlide = MainVideoSlide | MainImageSlide;
