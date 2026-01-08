import * as SQLite from 'expo-sqlite/legacy';

export const DBConnect = () => {
    const db = SQLite.openDatabase('studynote.db');

    return db;
}