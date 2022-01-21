import React, { useEffect, useReducer } from "react";

const initialState = {
  files: [],
  previews: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPLOAD":
      return {
        ...state,
        files: [...state.files, ...action.payload.files],
        previews: [...state.previews, ...action.payload.previews],
      };

    case "DELETE_ONE":
      return {
        ...state,
        files: [...action.payload.files],
        previews: [...action.payload.previews],
      };

    default:
      return {
        ...initialState,
      };
  }
};

const useUploadImg = () => {
  const [data, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // console.log(data);
  });

  const onChange = (e) => {
    const files = [...e.target.files];
    const dataURLs = files.map((file) => URL.createObjectURL(file));

    dispatch({
      type: "UPLOAD",
      payload: {
        files,
        previews: dataURLs,
      },
    });
    e.target.value = null;
  };

  const onDone = () => {
    dispatch({
      type: "DELETE_ALL",
    });
  };

  const onRemoveOne = (index) => {
    const newFiles = data.files.filter((_, id) => id !== index);
    const newPreviews = data.previews.filter((_, id) => id !== index);

    dispatch({
      type: "DELETE_ONE",
      payload: {
        files: newFiles,
        previews: newPreviews,
      },
    });
  };

  return [data, onChange, onDone, onRemoveOne];
};

export default useUploadImg;
