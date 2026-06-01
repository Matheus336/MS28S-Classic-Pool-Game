const GameConfig = {
  ENABLE_LOGGING: false,
  BALL_SIZE: 38,
  BORDER_SIZE: 57,
  HOLE_RADIUS: 46,
  DELTA_TIME: 1 / 100,
  DEFAULT_TRAINING_ITERATIONS: 100,
  DEFAULT_AI_PLAYER_INDEX: 1,
};

const LOG = GameConfig.ENABLE_LOGGING;
const BALL_SIZE = GameConfig.BALL_SIZE;
const BORDER_SIZE = GameConfig.BORDER_SIZE;
const HOLE_RADIUS = GameConfig.HOLE_RADIUS;
const DELTA = GameConfig.DELTA_TIME;
const DEFAULT_TRAIN_ITERATIONS = GameConfig.DEFAULT_TRAINING_ITERATIONS;
const DEFAULT_AI_PLAYER = GameConfig.DEFAULT_AI_PLAYER_INDEX;

const GameState = {
  DISPLAY_ENABLED: true,
  SOUND_ENABLED: true,
  IS_GAME_STOPPED: true,
  KEYBOARD_INPUT_ENABLED: true,
  AI_ENABLED: true,
  DISPLAY_TRAINING_ENABLED: false,
  TRAINING_ITERATIONS: GameConfig.DEFAULT_TRAINING_ITERATIONS,
  AI_PLAYER_INDEX: GameConfig.DEFAULT_AI_PLAYER_INDEX,
};

let DISPLAY = GameState.DISPLAY_ENABLED;
let SOUND_ON = GameState.SOUND_ENABLED;
let GAME_STOPPED = GameState.IS_GAME_STOPPED;
let KEYBOARD_INPUT_ON = GameState.KEYBOARD_INPUT_ENABLED;
let TRAIN_ITER = GameState.TRAINING_ITERATIONS;
let AI_ON = GameState.AI_ENABLED;
let AI_PLAYER_NUM = GameState.AI_PLAYER_INDEX;
let DISPLAY_TRAINING = GameState.DISPLAY_TRAINING_ENABLED;

/*
**
** REFATORAÇÃO 1: Extract Class + Replace Magic Number with Symbolic Constant
** 
** Agrupa as constantes relacionadas em um objeto de configuração (GameConfig e GameState) 
** para melhorar a organização e a legibilidade do código. Além disso, substitui os números 
** mágicos por constantes nomeadas, tornando o código mais fácil de entender e manter.

const LOG = false; 
const BALL_SIZE = 38; 
const BORDER_SIZE = 57; 
const HOLE_RADIUS = 46; 
const DELTA = 1/100; 

let DISPLAY = true; 
let SOUND_ON = true; 
let GAME_STOPPED = true; 
let KEYBOARD_INPUT_ON = true; 
let TRAIN_ITER = 100; 
let AI_ON = true; 
let AI_PLAYER_NUM = 1; 
let DISPLAY_TRAINING = false;

**
*/
