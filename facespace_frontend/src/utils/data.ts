import culture from "../assets/culture.jpg";
import education from "../assets/education.jpg";
import gaming from "../assets/gaming.jpg";
import government from "../assets/government.jpg";
import music from "../assets/music.jpg";
import nature from "../assets/nature.jpg";
import religion from "../assets/religion.jpg";
import science from "../assets/science.jpg";
import sports from "../assets/sports.jpg";
import technology from "../assets/technology.jpg";
import world from "../assets/world.jpg";

export const categories = [
  {
    name: "culture",
    image: culture,
  },
  {
    name: "education",
    image: education,
  },
  {
    name: "gaming",
    image: gaming,
  },
  {
    name: "government",
    image: government,
  },
  {
    name: "music",
    image: music,
  },
  {
    name: "nature",
    image: nature,
  },
  {
    name: "religion",
    image: religion,
  },
  {
    name: "science",
    image: science,
  },
  {
    name: "sports",
    image: sports,
  },
  {
    name: "technology",
    image: technology,
  },
  {
    name: "world",
    image: world,
  },
  {
    name: "misc (other)",
    image: world,
  },
];

export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc) {
  image {
    asset -> {
      url
    }
  },
  _id,
  destination,
  postedBy -> {
    _id,
    userName,
    image
  },
  "save": *[_type == 'save' && references(^._id)] {
    _key,
    postedBy -> {
      _id,
      userName,
      image
    },
  }
}`;

export const pinDetailQuery = (pinID: string) => {
  const query = `*[_type == "pin" && _id == '${pinID}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
   save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

export const pinDetailMorePinQuery = (pin: {
  category: string;
  _id: string;
}) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const searchQuery = (searchTerm: string) => {
  const query = `*[_type == 'pin' && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
    image {
      asset -> {
        url
      }
    },
    _id,
    destination,
    postedBy -> {
      _id,
      userName,
      image
    },
    save[] {
      _key,
      postedBy -> {
        _id,
        userName,
        image
      },
    },
  }`;

  return query;
};

export const userQuery = (userID: string) => {
  const query = `*[_type == "user" && _id == '${userID}']`;
  return query;
};

export const userCreatedPinsQuery = (userID: string) => {
  const query = `*[ _type == 'pin' && userID == '${userID}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userSavedPinsQuery = (userID: string) => {
  const query = `*[_type == 'pin' && '${userID}' in save[].userID ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};
