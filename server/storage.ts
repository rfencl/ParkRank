import { type Park, type InsertPark, type Vote, type InsertVote, type ParkWithRank, type VoteWithParks } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Parks
  getAllParks(): Promise<Park[]>;
  getPark(id: string): Promise<Park | undefined>;
  createPark(park: InsertPark): Promise<Park>;
  updatePark(id: string, updates: Partial<Park>): Promise<Park | undefined>;
  getRandomMatchup(): Promise<[Park, Park] | null>;
  getRankedParks(): Promise<ParkWithRank[]>;

  // Votes
  createVote(vote: InsertVote): Promise<Vote>;
  getRecentVotes(limit?: number): Promise<VoteWithParks[]>;
  getTotalVotes(): Promise<number>;
  getVotesToday(): Promise<number>;
}

export class MemStorage implements IStorage {
  private parks: Map<string, Park>;
  private votes: Vote[];

  constructor() {
    this.parks = new Map();
    this.votes = [];
    this.initializeParks();
  }

  private initializeParks() {
    const nationalParks: Omit<Park, 'totalVotes' | 'wins' | 'losses' | 'elo'>[] = [
      {
        id: 'acadia',
        name: 'Acadia',
        location: 'Maine',
        description: 'Covering most of Mount Desert Island and other coastal islands, Acadia features the tallest mountain on the Atlantic coast of the United States, granite peaks, ocean shoreline, woodlands, and lakes.',
        imageUrl: '/images/parks/acadia.jpg',
        dateEstablished: 'February 26, 1919',
        area: '49,071.40 acres',
        visitors: '3,961,661',
        emoji: '🌊'
      },
      {
        id: 'american-samoa',
        name: 'American Samoa',
        location: 'American Samoa',
        description: 'The southernmost national park is on three Samoan islands in the South Pacific. It protects coral reefs, rainforests, volcanic mountains, and white beaches.',
        imageUrl: '/images/parks/american-samoa.jpg',
        dateEstablished: 'October 31, 1988',
        area: '8,256.67 acres',
        visitors: '22,567',
        emoji: '🏝️'
      },
      {
        id: 'arches',
        name: 'Arches',
        location: 'Utah',
        description: 'This red-rock wonderland features more than 2,000 natural sandstone arches, including the world-famous Delicate Arch. The park preserves over 76,000 acres of high desert landscape.',
        imageUrl: '/images/parks/arches.jpg',
        dateEstablished: 'November 12, 1971',
        area: '76,678.98 acres',
        visitors: '1,806,865',
        emoji: '🌅'
      },
      {
        id: 'badlands',
        name: 'Badlands',
        location: 'South Dakota',
        description: 'Layered rock formations tell the story of 75 million years of geological history. This otherworldly landscape contains the largest undisturbed mixed grass prairie in the National Park System.',
        imageUrl: '/images/parks/badlands.jpg',
        dateEstablished: 'November 10, 1978',
        area: '242,755.94 acres',
        visitors: '1,207,534',
        emoji: '🏔️'
      },
      {
        id: 'big-bend',
        name: 'Big Bend',
        location: 'Texas',
        description: 'Named for the prominent bend in the Rio Grande, encompassing a large part of the Chihuahuan Desert with diverse wildlife.',
        imageUrl: '/images/parks/big-bend.jpg',
        dateEstablished: 'June 12, 1944',
        area: '801,163 acres',
        visitors: '561,458',
        emoji: '🌵'
      },
      {
        id: 'biscayne',
        name: 'Biscayne',
        location: 'Florida',
        description: 'A mostly underwater park protecting four marine ecosystems: mangrove forest, the Bay, the Keys, and coral reefs.',
        imageUrl: '/images/parks/biscayne.jpg',
        dateEstablished: 'June 28, 1980',
        area: '172,971 acres',
        visitors: '512,213',
        emoji: '🐠'
      },
      {
        id: 'black-canyon-gunnison',
        name: 'Black Canyon of the Gunnison',
        location: 'Colorado',
        description: 'Protects a quarter of the Gunnison River, featuring some of the steepest cliffs and oldest rock in North America.',
        imageUrl: '/images/parks/black-canyon-gunnison.jpg',
        dateEstablished: 'October 21, 1999',
        area: '30,780 acres',
        visitors: '335,862',
        emoji: '⛰️'
      },
      {
        id: 'bryce-canyon',
        name: 'Bryce Canyon',
        location: 'Utah',
        description: 'A geological amphitheater with hundreds of tall, multicolored sandstone hoodoos formed by erosion.',
        imageUrl: '/images/parks/bryce-canyon.jpg',
        dateEstablished: 'February 25, 1928',
        area: '35,835 acres',
        visitors: '2,498,075',
        emoji: '🗻'
      },
      {
        id: 'canyonlands',
        name: 'Canyonlands',
        location: 'Utah',
        description: 'A landscape eroded into canyons, buttes, and mesas by the Colorado and Green Rivers, containing ancient Pueblo artifacts.',
        imageUrl: '/images/parks/canyonlands.jpg',
        dateEstablished: 'September 12, 1964',
        area: '337,598 acres',
        visitors: '818,492',
        emoji: '🏔️'
      },
      {
        id: 'capitol-reef',
        name: 'Capitol Reef',
        location: 'Utah',
        description: 'Features the Waterpocket Fold, a 100-mile monocline exhibiting diverse geologic layers and sandstone domes.',
        imageUrl: '/images/parks/capitol-reef.jpg',
        dateEstablished: 'December 18, 1971',
        area: '241,905 acres',
        visitors: '1,422,490',
        emoji: '🏛️'
      },
      {
        id: 'carlsbad-caverns',
        name: 'Carlsbad Caverns',
        location: 'New Mexico',
        description: 'Features 117 caves including the famous Big Room, home to over 400,000 Mexican free-tailed bats.',
        imageUrl: '/images/parks/carlsbad-caverns.jpg',
        dateEstablished: 'May 14, 1930',
        area: '46,766 acres',
        visitors: '460,474',
        emoji: '🦇'
      },
      {
        id: 'channel-islands',
        name: 'Channel Islands',
        location: 'California',
        description: 'Five protected islands with unique Mediterranean ecosystem, home to over 2,000 species including the endemic island fox.',
        imageUrl: '/images/parks/channel-islands.jpg',
        dateEstablished: 'March 5, 1980',
        area: '249,561 acres',
        visitors: '262,581',
        emoji: '🦊'
      },
      {
        id: 'congaree',
        name: 'Congaree',
        location: 'South Carolina',
        description: 'The largest portion of old-growth floodplain forest in North America, featuring some of the tallest trees in the eastern US.',
        imageUrl: '/images/parks/congaree.jpg',
        dateEstablished: 'November 10, 2003',
        area: '26,693 acres',
        visitors: '242,049',
        emoji: '🌲'
      },
      {
        id: 'crater-lake',
        name: 'Crater Lake',
        location: 'Oregon',
        description: 'Features the deepest lake in the US, formed by a collapsed volcano, known for its deep blue color and clarity.',
        imageUrl: '/images/parks/crater-lake.jpg',
        dateEstablished: 'May 22, 1902',
        area: '183,224 acres',
        visitors: '647,751',
        emoji: '🌋'
      },
      {
        id: 'cuyahoga-valley',
        name: 'Cuyahoga Valley',
        location: 'Ohio',
        description: 'Preserves the rural landscape along the Cuyahoga River between Cleveland and Akron, featuring waterfalls and historic sites.',
        imageUrl: '/images/parks/cuyahoga-valley.jpg',
        dateEstablished: 'October 11, 2000',
        area: '32,572 acres',
        visitors: '2,575,275',
        emoji: '🚂'
      },
      {
        id: 'death-valley',
        name: 'Death Valley',
        location: 'California & Nevada',
        description: 'The hottest, driest, and lowest place in North America, featuring vast desert landscapes and unique geological formations.',
        imageUrl: '/images/parks/death-valley.jpg',
        dateEstablished: 'October 31, 1994',
        area: '3,372,402 acres',
        visitors: '1,740,945',
        emoji: '☠️'
      },
      {
        id: 'denali',
        name: 'Denali',
        location: 'Alaska',
        description: 'Home to North America\'s highest peak, featuring subarctic ecosystems and diverse wildlife including grizzly bears.',
        imageUrl: '/images/parks/denali.jpg',
        dateEstablished: 'February 26, 1917',
        area: '4,740,912 acres',
        visitors: '594,660',
        emoji: '🐻'
      },
      {
        id: 'dry-tortugas',
        name: 'Dry Tortugas',
        location: 'Florida',
        description: 'A remote park 70 miles west of Key West, protecting coral reefs, seagrass beds, and historic Fort Jefferson.',
        imageUrl: '/images/parks/dry-tortugas.jpg',
        dateEstablished: 'October 26, 1992',
        area: '64,701 acres',
        visitors: '56,810',
        emoji: '🏰'
      },
      {
        id: 'everglades',
        name: 'Everglades',
        location: 'Florida',
        description: 'The largest tropical wilderness in the US, protecting a unique wetland ecosystem home to diverse wildlife.',
        imageUrl: '/images/parks/everglades.jpg',
        dateEstablished: 'May 30, 1934',
        area: '1,508,938 acres',
        visitors: '942,130',
        emoji: '🐊'
      },
      {
        id: 'gates-arctic',
        name: 'Gates of the Arctic',
        location: 'Alaska',
        description: 'The northernmost and most remote park, entirely above the Arctic Circle, with no roads, trails, or facilities.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        dateEstablished: 'December 2, 1980',
        area: '7,523,898 acres',
        visitors: '11,904',
        emoji: '❄️'
      },
      {
        id: 'gateway-arch',
        name: 'Gateway Arch',
        location: 'Missouri',
        description: 'The smallest national park, featuring the iconic 630-foot Gateway Arch and museum celebrating westward expansion.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7d0e536?w=400&h=300&fit=crop',
        dateEstablished: 'February 22, 2018',
        area: '193 acres',
        visitors: '1,865,590',
        emoji: '🏛️'
      },
      {
        id: 'glacier',
        name: 'Glacier',
        location: 'Montana',
        description: 'Features over 700 miles of trails through pristine forests, alpine meadows, and rugged mountains with glacial-carved peaks.',
        imageUrl: '/images/parks/glacier.jpg',
        dateEstablished: 'May 11, 1910',
        area: '1,013,125 acres',
        visitors: '2,946,681',
        emoji: '🏔️'
      },
      {
        id: 'glacier-bay',
        name: 'Glacier Bay',
        location: 'Alaska',
        description: 'A marine wilderness featuring tidewater glaciers, fjords, and diverse marine wildlife including whales and seals.',
        imageUrl: '/images/parks/glacier-bay.jpg',
        dateEstablished: 'December 2, 1980',
        area: '3,223,384 acres',
        visitors: '89,768',
        emoji: '🐋'
      },
      {
        id: 'grand-canyon',
        name: 'Grand Canyon',
        location: 'Arizona',
        description: 'One of the most spectacular examples of erosion, revealing nearly 2 billion years of Earth\'s geological history.',
        imageUrl: '/images/parks/grand-canyon.jpg',
        dateEstablished: 'February 26, 1919',
        area: '1,201,647 acres',
        visitors: '5,974,411',
        emoji: '🏔️'
      },
      {
        id: 'grand-teton',
        name: 'Grand Teton',
        location: 'Wyoming',
        description: 'Features the dramatic Teton Range rising abruptly from the valley floor, with pristine lakes and diverse wildlife.',
        imageUrl: '/images/parks/grand-teton.jpg',
        dateEstablished: 'February 26, 1929',
        area: '310,044 acres',
        visitors: '3,417,106',
        emoji: '⛰️'
      },
      {
        id: 'great-basin',
        name: 'Great Basin',
        location: 'Nevada',
        description: 'A desert mountain park featuring ancient bristlecone pines, limestone caves, and the Wheeler Peak Glacier.',
        imageUrl: '/images/parks/great-basin.jpg',
        dateEstablished: 'October 27, 1986',
        area: '77,180 acres',
        visitors: '153,094',
        emoji: '🌲'
      },
      {
        id: 'great-sand-dunes',
        name: 'Great Sand Dunes',
        location: 'Colorado',
        description: 'Features North America\'s tallest sand dunes against the dramatic backdrop of the snow-capped Sangre de Cristo Mountains.',
        imageUrl: '/images/parks/great-sand-dunes.jpg',
        dateEstablished: 'September 13, 2004',
        area: '107,342 acres',
        visitors: '527,546',
        emoji: '🏜️'
      },
      {
        id: 'great-smoky-mountains',
        name: 'Great Smoky Mountains',
        location: 'Tennessee & North Carolina',
        description: 'Ancient mountains with diverse wildlife, waterfalls, and historic sites. The most visited national park.',
        imageUrl: '/images/parks/great-smoky-mountains.jpg',
        dateEstablished: 'June 15, 1934',
        area: '522,427 acres',
        visitors: '12,937,633',
        emoji: '🌿'
      },
      {
        id: 'guadalupe-mountains',
        name: 'Guadalupe Mountains',
        location: 'Texas',
        description: 'Features the highest peak in Texas and the world\'s most extensive Permian fossil reef, with diverse desert life.',
        imageUrl: '/images/parks/guadalupe-mountains.jpg',
        dateEstablished: 'October 15, 1966',
        area: '86,367 acres',
        visitors: '209,967',
        emoji: '🦎'
      },
      {
        id: 'haleakala',
        name: 'Haleakala',
        location: 'Hawaii',
        description: 'Features a massive shield volcano with diverse ecosystems from tropical rainforests to desert-like summit areas.',
        imageUrl: '/images/parks/haleakala.jpg',
        dateEstablished: 'August 1, 1916',
        area: '33,265 acres',
        visitors: '1,044,084',
        emoji: '🌺'
      },
      {
        id: 'hawaii-volcanoes',
        name: 'Hawaii Volcanoes',
        location: 'Hawaii',
        description: 'Home to two active volcanoes, showcasing ongoing volcanic processes and unique ecosystems created by lava flows.',
        imageUrl: '/images/parks/hawaii-volcanoes.jpg',
        dateEstablished: 'August 1, 1916',
        area: '325,605 acres',
        visitors: '1,116,891',
        emoji: '🌋'
      },
      {
        id: 'hot-springs',
        name: 'Hot Springs',
        location: 'Arkansas',
        description: 'The smallest national park in the lower 48, protecting natural hot springs and a historic bathhouse district.',
        imageUrl: '/images/parks/hot-springs.jpg',
        dateEstablished: 'March 4, 1921',
        area: '5,554 acres',
        visitors: '1,506,887',
        emoji: '♨️'
      },
      {
        id: 'indiana-dunes',
        name: 'Indiana Dunes',
        location: 'Indiana',
        description: 'Protects diverse ecosystems along Lake Michigan\'s southern shore, including beaches, dunes, wetlands, and prairies.',
        imageUrl: '/images/parks/indiana-dunes.jpg',
        dateEstablished: 'February 15, 2019',
        area: '15,349 acres',
        visitors: '2,293,106',
        emoji: '🏖️'
      },
      {
        id: 'isle-royale',
        name: 'Isle Royale',
        location: 'Michigan',
        description: 'A remote wilderness island park in Lake Superior, known for its wolf and moose populations and pristine ecosystems.',
        imageUrl: '/images/parks/isle-royale.jpg',
        dateEstablished: 'April 3, 1940',
        area: '571,790 acres',
        visitors: '28,965',
        emoji: '🐺'
      },
      {
        id: 'joshua-tree',
        name: 'Joshua Tree',
        location: 'California',
        description: 'Where the Mojave and Colorado deserts meet, featuring unique Joshua trees, rock formations, and diverse desert life.',
        imageUrl: '/images/parks/joshua-tree.jpg',
        dateEstablished: 'October 31, 1994',
        area: '792,726 acres',
        visitors: '3,058,294',
        emoji: '🌲'
      },
      {
        id: 'katmai',
        name: 'Katmai',
        location: 'Alaska',
        description: 'Famous for brown bears catching salmon at Brooks Falls, also featuring volcanic landscapes and pristine wilderness.',
        imageUrl: '/images/parks/katmai.jpg',
        dateEstablished: 'December 2, 1980',
        area: '3,674,530 acres',
        visitors: '33,908',
        emoji: '🐻'
      },
      {
        id: 'kenai-fjords',
        name: 'Kenai Fjords',
        location: 'Alaska',
        description: 'Features the Harding Icefield and coastal fjords carved by glaciers, with abundant marine wildlife.',
        imageUrl: '/images/parks/kenai-fjords.jpg',
        dateEstablished: 'December 2, 1980',
        area: '669,984 acres',
        visitors: '411,782',
        emoji: '🧊'
      },
      {
        id: 'kings-canyon',
        name: 'Kings Canyon',
        location: 'California',
        description: 'Features deep canyons, towering cliffs, and giant sequoia groves in the southern Sierra Nevada mountains.',
        imageUrl: '/images/parks/kings-canyon.jpg',
        dateEstablished: 'March 4, 1940',
        area: '461,901 acres',
        visitors: '633,129',
        emoji: '🌲'
      },
      {
        id: 'kobuk-valley',
        name: 'Kobuk Valley',
        location: 'Alaska',
        description: 'Protects the central portion of the Kobuk River valley, featuring sand dunes and important caribou migration routes.',
        imageUrl: '/images/parks/kobuk-valley.jpg',
        dateEstablished: 'December 2, 1980',
        area: '1,750,717 acres',
        visitors: '15,500',
        emoji: '🦌'
      },
      {
        id: 'lake-clark',
        name: 'Lake Clark',
        location: 'Alaska',
        description: 'A diverse park featuring active volcanoes, glaciers, wild rivers, and pristine lakes with abundant wildlife.',
        imageUrl: '/images/parks/lake-clark.jpg',
        dateEstablished: 'December 2, 1980',
        area: '2,619,816 acres',
        visitors: '19,714',
        emoji: '🏔️'
      },
      {
        id: 'lassen-volcanic',
        name: 'Lassen Volcanic',
        location: 'California',
        description: 'Features active volcanic features including hot springs, fumaroles, and the largest plug dome volcano in the world.',
        imageUrl: '/images/parks/lassen-volcanic.jpg',
        dateEstablished: 'August 9, 1916',
        area: '106,452 acres',
        visitors: '542,274',
        emoji: '🌋'
      },
      {
        id: 'mammoth-cave',
        name: 'Mammoth Cave',
        location: 'Kentucky',
        description: 'Protects the world\'s longest known cave system with over 400 miles of surveyed passageways.',
        imageUrl: '/images/parks/mammoth-cave.jpg',
        dateEstablished: 'July 1, 1941',
        area: '54,012 acres',
        visitors: '533,206',
        emoji: '🕳️'
      },
      {
        id: 'mesa-verde',
        name: 'Mesa Verde',
        location: 'Colorado',
        description: 'Preserves over 5,000 archaeological sites including spectacular cliff dwellings of the Ancient Pueblo peoples.',
        imageUrl: '/images/parks/mesa-verde.jpg',
        dateEstablished: 'June 29, 1906',
        area: '52,485 acres',
        visitors: '548,477',
        emoji: '🏛️'
      },
      {
        id: 'mount-rainier',
        name: 'Mount Rainier',
        location: 'Washington',
        description: 'Features an active volcano covered by glaciers, surrounded by wildflower meadows, old-growth forests, and pristine wilderness.',
        imageUrl: '/images/parks/mount-rainier.jpg',
        dateEstablished: 'March 2, 1899',
        area: '236,381 acres',
        visitors: '1,670,063',
        emoji: '🏔️'
      },
      {
        id: 'new-river-gorge',
        name: 'New River Gorge',
        location: 'West Virginia',
        description: 'The newest national park, protecting a deep river canyon carved through ancient mountains with world-class recreation.',
        imageUrl: '/images/parks/new-river-gorge.jpg',
        dateEstablished: 'December 27, 2020',
        area: '7,021 acres',
        visitors: '1,682,720',
        emoji: '🌉'
      },
      {
        id: 'north-cascades',
        name: 'North Cascades',
        location: 'Washington',
        description: 'A rugged alpine wilderness with jagged peaks, pristine forests, and over 300 glaciers in the American Alps.',
        imageUrl: '/images/parks/north-cascades.jpg',
        dateEstablished: 'October 2, 1968',
        area: '504,654 acres',
        visitors: '30,154',
        emoji: '⛰️'
      },
      {
        id: 'olympic',
        name: 'Olympic',
        location: 'Washington',
        description: 'Features diverse ecosystems from Pacific coastline to temperate rainforests to alpine areas, with unique wildlife.',
        imageUrl: '/images/parks/olympic.jpg',
        dateEstablished: 'June 29, 1938',
        area: '922,649 acres',
        visitors: '2,718,925',
        emoji: '🌲'
      },
      {
        id: 'petrified-forest',
        name: 'Petrified Forest',
        location: 'Arizona',
        description: 'Features one of the world\'s largest concentrations of petrified wood and fossils from the Late Triassic period.',
        imageUrl: '/images/parks/petrified-forest.jpg',
        dateEstablished: 'December 9, 1962',
        area: '221,390 acres',
        visitors: '590,334',
        emoji: '🪨'
      },
      {
        id: 'pinnacles',
        name: 'Pinnacles',
        location: 'California',
        description: 'Protects unique rock formations created by ancient volcanic activity, home to endangered California condors.',
        imageUrl: '/images/parks/pinnacles.jpg',
        dateEstablished: 'January 10, 2013',
        area: '26,686 acres',
        visitors: '348,857',
        emoji: '🦅'
      },
      {
        id: 'redwood',
        name: 'Redwood',
        location: 'California',
        description: 'Protects nearly half of the remaining coastal redwoods, the tallest trees on Earth, along with pristine coastline.',
        imageUrl: '/images/parks/redwood.jpg',
        dateEstablished: 'October 2, 1968',
        area: '138,999 acres',
        visitors: '435,879',
        emoji: '🌲'
      },
      {
        id: 'rocky-mountain',
        name: 'Rocky Mountain',
        location: 'Colorado',
        description: 'Features majestic mountain environments with wildlife, varied climates, and environments from meadows to alpine tundra.',
        imageUrl: '/images/parks/rocky-mountain.jpg',
        dateEstablished: 'January 26, 1915',
        area: '265,807 acres',
        visitors: '4,300,424',
        emoji: '🏔️'
      },
      {
        id: 'saguaro',
        name: 'Saguaro',
        location: 'Arizona',
        description: 'Protects part of the Sonoran Desert, including forests of the giant saguaro cactus and diverse desert wildlife.',
        imageUrl: '/images/parks/saguaro.jpg',
        dateEstablished: 'October 14, 1994',
        area: '92,867 acres',
        visitors: '1,020,226',
        emoji: '🌵'
      },
      {
        id: 'sequoia',
        name: 'Sequoia',
        location: 'California',
        description: 'Home to giant sequoia trees including General Sherman, the world\'s largest tree, and diverse Sierra Nevada ecosystems.',
        imageUrl: '/images/parks/sequoia.jpg',
        dateEstablished: 'September 25, 1890',
        area: '404,064 acres',
        visitors: '1,059,548',
        emoji: '🌲'
      },
      {
        id: 'shenandoah',
        name: 'Shenandoah',
        location: 'Virginia',
        description: 'Features cascading waterfalls, spectacular vistas, and diverse plant and animal life along the Blue Ridge Mountains.',
        imageUrl: '/images/parks/shenandoah.jpg',
        dateEstablished: 'December 26, 1935',
        area: '199,173 acres',
        visitors: '1,666,265',
        emoji: '🍂'
      },
      {
        id: 'theodore-roosevelt',
        name: 'Theodore Roosevelt',
        location: 'North Dakota',
        description: 'Preserves part of the colorful North Dakota Badlands where Theodore Roosevelt ranched and developed his conservation ethic.',
        imageUrl: '/images/parks/theodore-roosevelt.jpg',
        dateEstablished: 'November 10, 1978',
        area: '70,447 acres',
        visitors: '749,389',
        emoji: '🦬'
      },
      {
        id: 'virgin-islands',
        name: 'Virgin Islands',
        location: 'U.S. Virgin Islands',
        description: 'Preserves tropical ecosystems and cultural history on three Caribbean islands with pristine beaches and coral reefs.',
        imageUrl: '/images/parks/virgin-islands.jpg',
        dateEstablished: 'August 2, 1956',
        area: '14,689 acres',
        visitors: '133,398',
        emoji: '🏝️'
      },
      {
        id: 'voyageurs',
        name: 'Voyageurs',
        location: 'Minnesota',
        description: 'A water-based park featuring pristine lakes, islands, and waterways with a rich history of fur trading.',
        imageUrl: '/images/parks/voyageurs.jpg',
        dateEstablished: 'April 8, 1975',
        area: '218,222 acres',
        visitors: '263,091',
        emoji: '🛶'
      },
      {
        id: 'white-sands',
        name: 'White Sands',
        location: 'New Mexico',
        description: 'Features the world\'s largest gypsum dune field with brilliant white sand dunes and unique desert life.',
        imageUrl: '/images/parks/white-sands.jpg',
        dateEstablished: 'December 20, 2019',
        area: '146,344 acres',
        visitors: '608,785',
        emoji: '🏜️'
      },
      {
        id: 'wind-cave',
        name: 'Wind Cave',
        location: 'South Dakota',
        description: 'Features one of the world\'s longest and most complex caves and protects mixed-grass prairie above ground.',
        imageUrl: '/images/parks/wind-cave.jpg',
        dateEstablished: 'January 9, 1903',
        area: '33,970 acres',
        visitors: '716,295',
        emoji: '🌪️'
      },
      {
        id: 'wrangell-st-elias',
        name: 'Wrangell-St. Elias',
        location: 'Alaska',
        description: 'The largest national park, featuring glaciers, peaks, and diverse wildlife in a vast wilderness setting.',
        imageUrl: '/images/parks/wrangell-st-elias.jpg',
        dateEstablished: 'December 2, 1980',
        area: '8,323,148 acres',
        visitors: '78,305',
        emoji: '🏔️'
      },
      {
        id: 'yellowstone',
        name: 'Yellowstone',
        location: 'Wyoming, Montana & Idaho',
        description: 'The world\'s first national park, featuring geothermal wonders, diverse wildlife, and pristine wilderness.',
        imageUrl: '/images/parks/yellowstone.jpg',
        dateEstablished: 'March 1, 1872',
        area: '2,219,791 acres',
        visitors: '4,501,382',
        emoji: '🌋'
      },
      {
        id: 'yosemite',
        name: 'Yosemite',
        location: 'California',
        description: 'Features towering waterfalls, granite cliffs, clear streams, and diverse ecosystems in the Sierra Nevada.',
        imageUrl: '/images/parks/yosemite.jpg',
        dateEstablished: 'October 1, 1890',
        area: '759,620 acres',
        visitors: '3,667,550',
        emoji: '🏔️'
      },
      {
        id: 'zion',
        name: 'Zion',
        location: 'Utah',
        description: 'Features massive sandstone cliffs, narrow slot canyons, and diverse plant and animal life in the Colorado Plateau.',
        imageUrl: '/images/parks/zion.jpg',
        dateEstablished: 'November 19, 1919',
        area: '147,242 acres',
        visitors: '4,624,448',
        emoji: '🏜️'
      }
    ];

    // Initialize all parks with starting ELO of 1500
    nationalParks.forEach(parkData => {
      const park: Park = {
        ...parkData,
        elo: 1500,
        totalVotes: 0,
        wins: 0,
        losses: 0
      };
      this.parks.set(park.id, park);
    });
  }

  async getAllParks(): Promise<Park[]> {
    return Array.from(this.parks.values());
  }

  async getPark(id: string): Promise<Park | undefined> {
    return this.parks.get(id);
  }

  async createPark(park: InsertPark): Promise<Park> {
    const newPark: Park = {
      ...park,
      elo: park.elo || 1500,
      totalVotes: 0,
      wins: 0,
      losses: 0,
      area: park.area || null,
      dateEstablished: park.dateEstablished || null,
      visitors: park.visitors || null,
      emoji: park.emoji || '🏞️',
    };
    this.parks.set(newPark.id, newPark);
    return newPark;
  }

  async updatePark(id: string, updates: Partial<Park>): Promise<Park | undefined> {
    const park = this.parks.get(id);
    if (!park) return undefined;

    const updatedPark = { ...park, ...updates };
    this.parks.set(id, updatedPark);
    return updatedPark;
  }

  async getRandomMatchup(): Promise<[Park, Park] | null> {
    const parks = Array.from(this.parks.values());
    if (parks.length < 2) return null;

    const shuffled = parks.sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  }

  async getRankedParks(): Promise<ParkWithRank[]> {
    const parks = Array.from(this.parks.values());
    const sorted = parks.sort((a, b) => b.elo - a.elo);

    return sorted.map((park, index) => ({
      ...park,
      rank: index + 1,
      change: 0 // TODO: Calculate actual change from previous rankings
    }));
  }

  async createVote(vote: InsertVote): Promise<Vote> {
    const newVote: Vote = {
      id: randomUUID(),
      winnerId: vote.winnerId,
      loserId: vote.loserId,
      winnerEloChange: vote.winnerEloChange,
      loserEloChange: vote.loserEloChange,
      winnerEloAfter: vote.winnerEloAfter,
      loserEloAfter: vote.loserEloAfter,
      createdAt: new Date()
    };
    this.votes.push(newVote);
    return newVote;
  }

  async getRecentVotes(limit: number = 10): Promise<VoteWithParks[]> {
    const recentVotes = this.votes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return recentVotes.map(vote => {
      const winner = this.parks.get(vote.winnerId);
      const loser = this.parks.get(vote.loserId);
      return {
        ...vote,
        winnerName: winner?.name || 'Unknown',
        loserName: loser?.name || 'Unknown'
      };
    });
  }

  async getTotalVotes(): Promise<number> {
    return this.votes.length;
  }

  async getVotesToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.votes.filter(vote => vote.createdAt >= today).length;
  }
}

export const storage = new MemStorage();