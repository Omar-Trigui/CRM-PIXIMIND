const initialState = {
  cards: [],
};

function DealReducer(state = initialState, action) {
  //let nextState;
  if (action.type === "SET_DEAL") {
    return Object.assign({}, state, {
      ...state,
      cards: [...state.cards, action.data],
    });
  }
  if (action.type === "SET_NEW_DEALS") {
    return Object.assign({}, state, {
      ...state,
      cards: action.data,
    });
  }
  if (action.type === "CHANGE_POSITION") {
    var stateCopy = Object.assign({}, state);
    stateCopy.cards[action.data.position].dealStage = action.data.target;
    return stateCopy;
  }
  return state;
  // switch (action.type) {
  //   case :
  //     // nextState = {
  //     //   ...state,
  //     //   cards: [...state.cards, action.data]

  //     // };
  //     return { ...state, cards :[...state.cards, action.data]};
  //   //console.log(typeof state.cards[0]);

  //     // return Object.assign({}, state, {
  //     //   ...state,
  //     //   cards: state.cards.push(action.data),
  //     // });
  //   case "SET_PIPELINE":
  //     nextState = {
  //       ...state,
  //       Pipeline: action.data,
  //     };
  //     return nextState;

  //   default:

  // }
}
export default DealReducer;

// import _ from "lodash";

// const initialState = {
//   cards: [],
// };

// function DealReducer(state = initialState, action) {
//  // let nextState;
//   if (action.type === "SET_DEAL") {
//     return Object.assign({}, state, {
//       ...state,
//       cards: [...state.cards, action.data],
//     });
//    // state.cards = [...state.cards, action.data];
//   }
//   return state;
//   // switch (action.type) {
//   //   case "SET_DEAL":
//   //     return Object.assign({}, state, {
//   //       ...state,
//   //       cards: [...state.cards, action.data],
//   //     });

//   //   case "CHANGE_POSITION":
//   //     //console.log(action.data);
//   //     let postion = _.findIndex(state.cards, function (card) {
//   //       return card._id === action.data.ID;
//   //     });
//   //     let stateCopy = Object.assign({}, state);
//   //     stateCopy.cards[postion].dealStage = action.data.target;
//   //     console.log(stateCopy);

//   //   //  return Object.assign({}, state, {
//   //   //    ...state,
//   //   //    cards: stateCopy.cards,
//   //   //  });
//   //   // console.log(state.cards[postion]);
//   //     nextState = {
//   //       ...stateCopy,
//   //     };
//   //     return nextState;

//   //   default:
//   //     return state;
//   //}
// }
// export default DealReducer;
