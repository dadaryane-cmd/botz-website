import * as migration_20261013_121433_initial from './20261013_121433_initial';
import * as migration_20261014_073753_hero_flame_variant from './20261014_073753_hero_flame_variant';
import * as migration_20261014_114611_hero_burn_words from './20261014_114611_hero_burn_words';
import * as migration_20261015_174148_trust_sections_offer from './20261015_174148_trust_sections_offer';

export const migrations = [
  {
    up: migration_20261013_121433_initial.up,
    down: migration_20261013_121433_initial.down,
    name: '20261013_121433_initial',
  },
  {
    up: migration_20261014_073753_hero_flame_variant.up,
    down: migration_20261014_073753_hero_flame_variant.down,
    name: '20261014_073753_hero_flame_variant',
  },
  {
    up: migration_20261014_114611_hero_burn_words.up,
    down: migration_20261014_114611_hero_burn_words.down,
    name: '20261014_114611_hero_burn_words',
  },
  {
    up: migration_20261015_174148_trust_sections_offer.up,
    down: migration_20261015_174148_trust_sections_offer.down,
    name: '20261015_174148_trust_sections_offer'
  },
];
