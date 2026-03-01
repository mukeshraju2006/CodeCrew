import initialDB from "./db.json";

const KEY = "mini-db";

export const initDB = () => {
  if (!localStorage.getItem(KEY)) {
    localStorage.setItem(
      KEY,
      JSON.stringify(initialDB)
    );
  }
};

export const readDB = () => {
  return JSON.parse(localStorage.getItem(KEY));
};

export const writeDB = (db) => {
  localStorage.setItem(KEY, JSON.stringify(db));
};