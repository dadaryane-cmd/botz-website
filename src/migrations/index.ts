import * as migration_20261013_121433_initial from './20261013_121433_initial';
import * as migration_20261014_073753_hero_flame_variant from './20261014_073753_hero_flame_variant';

export const migrations = [
  {
    up: migration_20261013_121433_initial.up,
    down: migration_20261013_121433_initial.down,
    name: '20261013_121433_initial',
  },
  {
    up: migration_20261014_073753_hero_flame_variant.up,
    down: migration_20261014_073753_hero_flame_variant.down,
    name: '20261014_073753_hero_flame_variant'
  },
];
