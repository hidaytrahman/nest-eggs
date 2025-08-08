export enum GenderType {
  Male = "male",
  Female = "female",
}

export enum Role {
  User = "user",
  Admin = "admin",
}

export type SearchUserByQueryType = {
  gender: GenderType;
  firstName: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string; //'emily.johnson@x.dummyjson.com';
  phone: string; // '+81 965-431-3024'
  username: string;
  password: string;
  birthDate: string; // '1996-5-30'
  image: string;
  bloodGroup: string; // 'O-'
  height: number;
  weight: number;
  eyeColor: string; // 'Green' or "#ccc"
  hair: {
    color: string; // 'Brown' or "#ccc"
    type: string; // 'Curly'
  };
  ip: string; // '42.48.100.32'
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number; // -77.16213
      lng: number; // -92.084824
    };
    country: string; // type needed
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string; // '03/26'
    cardNumber: string; // '9289760655481815'
    cardType: string; // 'Elo'
    currency: string; // 'CNY' | 'INR'
    iban: string; // 'YPUXISOBI7TTHPK2BR3HAIXL'
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string; // '977-175'
  ssn: string; // '900-590-289'
  userAgent: string;
  role: string; // or "moderator", or "user"
};

type ResponseType = {
  message?: string;
  total?: number;
  skip?: number;
  limit?: number;
};

export type UsersResponseType = ResponseType & {
  users: User[];
};

export type NotPositiveResponse = {
  message: string;
};
