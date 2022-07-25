const initInventory = {
  inventoryFile: null,
};

export const inventoryReducer = (state = initInventory, action) => {
  switch (action.type) {
    case "SET_FILE_INVENTORY":
      return {
        ...state,
        inventoryFile: action.value,
      };

    default:
      return state;
  }
};
