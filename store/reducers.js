import { ACTIONS } from './actions';

const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CART_ITEMS_COUNT:
      return {
        ...state,
        cartItemCount: action.payload,
      };
    case ACTIONS.TRUE_OPEN_LOGIN:
      return {
        ...state,
        openLogin: true,
      };
    case ACTIONS.FALSE_OPEN_LOGIN:
      return {
        ...state,
        openLogin: false,
      };
      
    case ACTIONS.TRUE_OPEN_SEARCH:
      return {
        ...state,
        openSearch: true,
      };
    case ACTIONS.FALSE_OPEN_SEARCH:
      return {
        ...state,
        openSearch: false,
      };

    case ACTIONS.FALSE_IS_PAYMENT_METHOD_SELECTED:
      return {
        ...state,
        isPaymentMethodChecked: false,
      };
    case ACTIONS.TRUE_IS_PAYMENT_METHOD_SELECTED:
      return {
        ...state,
        isPaymentMethodChecked: true,
      };
      
    case ACTIONS.RELOAD_CART:
      return {
        ...state,
        cartReload: ()=> !state.cartReload,
      };
    case ACTIONS.TRUE_GLOBAL_USER_lOGIN:
      return {
        ...state,
        userLoggedInGlobal: true,
      };
      case ACTIONS.FALSE_GLOBAL_USER_lOGIN:
        return {
          ...state,
          userLoggedInGlobal: false,
        };
    default:
      return state;
  }
};

export default reducers;
