import gql from 'graphql-tag';

export const GET_USER_WITH_TOKEN = gql`
	query GetUserWithToken($token: String!) {
		getUserWithToken(token: $token) {
			name
			email
			phone
			coins
			photoURL
			raffles {
				_id
				price
			}
		}
	}
`;

export const GET_TICKET = gql`
	query {
		getTicket {
			selected {
				number
				value
			}
		}
	}  
`;

export const AUTH = gql`
	mutation Auth($token: String!, $provider: String!) {
		auth(token: $token, provider: $provider) {
			token
			name
			email
			phone
			coins
			photoURL
			raffles {
				_id
				price
			}
		}
	}
`;

export const GET_RAFFLES = gql`
	query {
		getRaffles {
    		price
			usersCount
		}
	}
`;

export const GET_HISTORY = gql`
	query {
		getHistory {
    		price
			user
			createAt
		}
	}
`;

export const PARTICIPATE_RAFFLE = gql`
	mutation IncrementRaffle($price: Float!, $coins: Int!) {
		incrementRaffle(price: $price, coins: $coins) {
			coins
			count
		}
	}
`;
