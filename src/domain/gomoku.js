//https://en.wikipedia.org/wiki/Go_(game)

require('dotenv').config();

const ERR_MSGS = require('../util/error_messages.js');

const MINIMUM_WIN_LENGTH = 5;
const DEFAULT_COLS = 20;
const DEFAULT_ROWS = 15;

const COLS = process.env.COLS || DEFAULT_COLS;
const ROWS = process.env.ROWS || DEFAULT_ROWS;

const isTie = (board) => {
    for (let col = 1; col <= (board.cols); col++){
        for (let row = 1; row <= (board.rows); row++){
            if(board.tiles[col][row] == 0) return false;
        }
    }
    return !isWin(board);
}

const isWin = (board) => {
   for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
        const tile = { row, col };
        if (testRow(diagonal(tile), board)) return true;
        if (testRow(horizontal(tile), board)) return true;
        if (testRow(vertical(tile), board)) return true;
    }
}
    return false;
}

const createBoard = () => {
    return {
        minInRow: 5,
        ROWS,
        COLS,
        tiles: Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    };
};

const play = (board, col, row, player) => {
    if(col <= 0 || row <= 0){
        throw(ERR_MSGS.ERR_TILE_OUT_OF_BOUNDS);
    }
    if(col > COLS || row > ROWS){
        throw(ERR_MSGS.ERR_TILE_OUT_OF_BOUNDS);
    }
    if(board.tiles[col][row] == 0){
        board.tiles[col][row] = player;
    }else{
        throw new Error(ERR_MSGS.ERR_TILE_OCCUPIED);
    }

    return board
}

const testRow = (row, board) => {
    for(let tile of row){
        if(tile.row > board.rows) return false;
        if(tile.col > board.cols) return false;
    }

    let player = null;
    for(let tile of row){
        player = board.tiles[tile.col][tile.row];
        if(player == null) return false;
    }

    for(let tile of row){
        if(player != board.tiles[tile.col][tile.row]) return false;
    }
    return true;
}

const diagonal = (tile) => {
    return [
        {col: tile.col, row: tile.row},
        {col: tile.col + 1, row: tile.row + 1},
        {col: tile.col + 2, row: tile.row + 2},
        {col: tile.col + 3, row: tile.row + 3},
        {col: tile.col + 4, row: tile.row + 4}
    ];
}

const horizontal = (tile) => {
    return [
        {col: tile.col, row: tile.row},
        {col: tile.col + 1, row: tile.row},
        {col: tile.col + 2, row: tile.row},
        {col: tile.col + 3, row: tile.row},
        {col: tile.col + 4, row: tile.row}
    ];
}

const vertical = (tile) => {
    return [
        {col: tile.col, row: tile.row},
        {col: tile.col, row: tile.row + 1},
        {col: tile.col, row: tile.row + 2},
        {col: tile.col, row: tile.row + 3},
        {col: tile.col, row: tile.row + 4}
    ];
}

module.exports = {play, isTie, isWin, createBoard}