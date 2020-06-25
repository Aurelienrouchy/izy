/* eslint-disable max-len */
import React, {
    useState, useReducer, useContext, createContext, useMemo
} from 'react';
import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';
import { GET_RAFFLES } from '../graphql/queries';

const Context = createContext();

const ContextFunctions = (state, dispatch, client) => useMemo(
    () => ({
        getRaffles: async () => {
            try {
                const querySubscription = await client.watchQuery({ query: GET_RAFFLES, pollInterval: 10000 });
                const { data: { getRaffles: data } } = await querySubscription.result();
                const raffles = await data.reduce((acc, cur) => ({...acc, [cur.price]: cur.usersCount}), {})
                
                dispatch({type: 'SET_RAFFLES', raffles});

                return {
                    querySubscription,
                    raffles
                };
            } catch (e) {
                throw Error(e);
            }
        },
        
    }),
    []
)
 
export { Context };

export default function Provider({ state, dispatch, children }) {
    const client = useApolloClient();
    const functions = ContextFunctions(state, dispatch, client);

    return <Context.Provider value={{...functions, state, dispatch}}>{children}</Context.Provider>;
}