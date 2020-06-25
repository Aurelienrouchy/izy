
export const reducer = (state, action) => {
    switch (action.type) {
        case 'GET_RAFFLES':
            return {
                ...state,
                raffles: action.raffles
            };
        case 'SIGN_UP':
            return {
                ...state,
                user: action.user,
            };
        case 'SIGN_OUT':
            return {
                ...state,
                isLogin: false,
                user: {}
            };
        case 'SIGN_IN':
            return {
                ...state,
                user: action.user,
                isLogin: action.isLogin
            };
        case 'SET_RAFFLES':
            return {
                ...state,
                raffles: action.raffles,
            };
        case 'TOGGLE_PARTICIPATE_MODAL_VISIBLE':
            return {
                ...state,
                isParticipateModalVisible: !state.isParticipateModalVisible,
            };
        case 'SET_CURRENT_RAFFLE':
            return {
                ...state,
                currentRaffle: action.card,
            };
        case 'UPADATE_COINS':
            return {
                ...state,
                user: {
                    ...state.user,
                    coins: action.coins
                }
            };
        case 'TOGGLE_DRAWER':
            return {
                ...state,
                drawerIsOpen: !state.drawerIsOpen
            };
        default:
            return state
    }
};

export const initialState = {
    user: {},
    token: null,
    isLogin: false,
    raffles: [],
    isTicketVisible: false,
    isAdsLoading: true,
    isParticipateModalVisible: false,
    currentRaffle: {},
    drawerIsOpen: false
};
