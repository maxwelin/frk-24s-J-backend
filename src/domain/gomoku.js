//https://en.wikipedia.org/wiki/Go_(game)

require('dotenv').config();

const { log } = require('winston');
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
    for (let row = 0; row < board.ROWS; row++) {
        for (let col = 0; col < board.COLS; col++) {
            const tile = { row, col };

            if (testRow(horizontal(tile), board)) return true;
            if (testRow(vertical(tile), board)) return true;
            if (testRow(diagonal(tile), board)) return true;
            if (testRow(antiDiagonal(tile), board)) return true;
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
    for (let tile of row) {
        if (
            tile.row < 0 || tile.row >= board.ROWS ||
            tile.col < 0 || tile.col >= board.COLS
        ) {
            return false;
        }
    }

    const first = row[0];
    const player = board.tiles[first.row][first.col];
    if (player === 0) return false;

    for (let tile of row) {
        if (board.tiles[tile.row][tile.col] !== player) return false;
    }

    return true;
}




const diagonal = (tile) => {
    return [
        { row: tile.row,     col: tile.col },
        { row: tile.row + 1, col: tile.col + 1 },
        { row: tile.row + 2, col: tile.col + 2 },
        { row: tile.row + 3, col: tile.col + 3 },
        { row: tile.row + 4, col: tile.col + 4 },
    ];
}


const horizontal = (tile) => {
    return [
        { row: tile.row, col: tile.col },
        { row: tile.row, col: tile.col + 1 },
        { row: tile.row, col: tile.col + 2 },
        { row: tile.row, col: tile.col + 3 },
        { row: tile.row, col: tile.col + 4 },
    ];
}


const vertical = (tile) => {
    return [
        { row: tile.row, col: tile.col },
        { row: tile.row + 1, col: tile.col },
        { row: tile.row + 2, col: tile.col },
        { row: tile.row + 3, col: tile.col },
        { row: tile.row + 4, col: tile.col },
    ];
}

const antiDiagonal = (tile) => [
    { row: tile.row, col: tile.col },
    { row: tile.row + 1, col: tile.col - 1 },
    { row: tile.row + 2, col: tile.col - 2 },
    { row: tile.row + 3, col: tile.col - 3 },
    { row: tile.row + 4, col: tile.col - 4 },
];


module.exports = {play, isTie, isWin, createBoard}