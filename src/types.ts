export interface Template {
  id: string;
  fields: any[];
  [key: string]: any;
}

export interface Connection {
  id: string;
  [key: string]: any;
}

export interface DataMakerResponse {
  live_data: any[];
}
