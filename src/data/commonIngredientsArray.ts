const commonIngredientsArray: string[] = [
  "apple",
  "apricot",
  "avocado",
  "banana",
  "blackberry",
  "blueberry",
  "boysenberry",
  "breadfruit",
  "cantaloupe",
  "cherry",
  "clementine",
  "coconut",
  "cranberry",
  "date",
  "dragon fruit",
  "durian",
  "elderberry",
  "fig",
  "gooseberry",
  "grape",
  "grapefruit",
  "guava",
  "honeydew melon",
  "jackfruit",
  "jujube",
  "kiwi",
  "kumquat",
  "lemon",
  "lime",
  "lychee",
  "mandarin",
  "mango",
  "mulberry",
  "nectarine",
  "orange",
  "papaya",
  "passion fruit",
  "peach",
  "pear",
  "persimmon",
  "pineapple",
  "plantain",
  "plum",
  "pomegranate",
  "pomelo",
  "quince",
  "raspberry",
  "redcurrant",
  "strawberry",
  "tamarind",
  "tangerine",
  "watermelon",
  "artichoke",
  "arugula",
  "asparagus",
  "eggplant",
  "beet",
  "bell pepper",
  "bok choy",
  "broccoli",
  "brussels sprouts",
  "cabbage",
  "carrot",
  "cauliflower",
  "celery",
  "chard",
  "collard greens",
  "corn",
  "cucumber",
  "daikon radish",
  "edamame",
  "endive",
  "fennel",
  "garlic",
  "ginger",
  "green bean",
  "jalapeño",
  "kale",
  "kohlrabi",
  "leek",
  "lettuce",
  "mushrooms",
  "mustard greens",
  "okra",
  "onion",
  "parsnip",
  "pea",
  "potato",
  "pumpkin",
  "radish",
  "rutabaga",
  "shallot",
  "snap pea",
  "spinach",
  "squash (butternut)",
  "sweet potato",
  "tomatillo",
  "tomato",
  "turnip",
  "watercress",
  "yam",
  "zucchini",
  "black beans",
  "black-eyed peas",
  "cannellini beans",
  "chickpeas",
  "great northern beans",
  "kidney beans",
  "lentils (brown)",
  "lentils (green)",
  "lentils (red)",
  "lima beans",
  "navy beans",
  "pinto beans",
  "split peas",
  "soybeans",
  "barley",
  "brown rice",
  "buckwheat",
  "bulgur",
  "cornmeal",
  "farro",
  "millet",
  "oats",
  "quinoa",
  "rye",
  "sorghum",
  "spelt",
  "wheat berries",
  "white rice",
  "wild rice",
  "angel hair pasta",
  "bow tie pasta",
  "egg noodles",
  "fettuccine",
  "linguine",
  "macaroni",
  "orzo",
  "penne",
  "ramen noodles",
  "rice noodles",
  "rigatoni",
  "rotini",
  "spaghetti",
  "udon noodles",
  "vermicelli",
  "whole wheat pasta",
  "almond",
  "brazil nut",
  "cashew",
  "chia seeds",
  "flaxseeds",
  "hazelnut",
  "hemp seeds",
  "macadamia nut",
  "peanut",
  "pecan",
  "pine nut",
  "pistachio",
  "pumpkin seeds",
  "sesame seeds",
  "sunflower seeds",
  "walnut",
  "basil",
  "bay leaf",
  "cilantro",
  "dill",
  "mint",
  "oregano",
  "parsley",
  "rosemary",
  "sage",
  "tarragon",
  "thyme",
  "allspice",
  "anise",
  "black pepper",
  "cardamom",
  "cayenne pepper",
  "chili powder",
  "cinnamon",
  "cloves",
  "coriander",
  "cumin",
  "curry powder",
  "fennel seeds",
  "five-spice powder",
  "garlic powder",
  "ginger (ground)",
  "mustard seeds",
  "nutmeg",
  "onion powder",
  "paprika",
  "red pepper flakes",
  "saffron",
  "turmeric",
  "vanilla bean",
  "white pepper",
  "bacon",
  "beef brisket",
  "beef ground",
  "beef steak",
  "chicken breast",
  "chicken drumstick",
  "chicken thigh",
  "chicken wing",
  "duck",
  "goat",
  "ground turkey",
  "ham",
  "lamb chops",
  "lamb ground",
  "pork",
  "pork chops",
  "pork ground",
  "pork loin",
  "pork ribs",
  "prosciutto",
  "sausage (pork)",
  "sausage (chicken)",
  "turkey breast",
  "turkey ground",
  "veal",
  "whole chicken",
  "whole turkey",
  "anchovies",
  "catfish",
  "clams",
  "cod",
  "crab",
  "eel",
  "haddock",
  "halibut",
  "lobster",
  "mackerel",
  "mussels",
  "octopus",
  "oysters",
  "salmon",
  "sardines",
  "scallops",
  "shrimp",
  "squid",
  "swordfish",
  "tilapia",
  "trout",
  "tuna",
  "blue cheese",
  "butter",
  "buttermilk",
  "cheddar cheese",
  "cottage cheese",
  "cream cheese",
  "feta cheese",
  "ghee",
  "goat cheese",
  "half and half",
  "heavy cream",
  "milk (skim)",
  "milk (whole)",
  "mozzarella",
  "parmesan",
  "provolone",
  "ricotta",
  "sour cream",
  "swiss cheese",
  "yogurt",
  "greek yogurt",
  "egg (chicken)",
  "egg (duck)",
  "egg whites",
  "egg yolks",
  "barbecue sauce",
  "chili sauce",
  "fish sauce",
  "hoisin sauce",
  "hot sauce",
  "ketchup",
  "mayonnaise",
  "mustard (dijon)",
  "mustard (yellow)",
  "relish",
  "salad dressing (italian)",
  "salad dressing (ranch)",
  "salsa",
  "soy sauce",
  "sriracha",
  "steak sauce",
  "tartar sauce",
  "teriyaki sauce",
  "vinegar (apple cider)",
  "vinegar (balsamic)",
  "vinegar (distilled white)",
  "vinegar (red wine)",
  "vinegar (rice)",
  "wasabi",
  "worcestershire sauce",
  "avocado oil",
  "canola oil",
  "coconut oil",
  "corn oil",
  "olive oil",
  "peanut oil",
  "sesame oil",
  "sunflower oil",
  "vegetable oil",
  "lard",
  "shortening",
  "bagel",
  "baguette",
  "biscuit",
  "bread (white)",
  "bread (whole wheat)",
  "croissant",
  "english muffin",
  "hamburger bun",
  "hot dog bun",
  "naan",
  "pita",
  "sourdough bread",
  "tortilla (corn)",
  "tortilla (flour)",
  "baking powder",
  "baking soda",
  "brown sugar",
  "cake flour",
  "chocolate chips",
  "cocoa powder",
  "corn starch",
  "cream of tartar",
  "granulated sugar",
  "powdered sugar",
  "salt",
  "yeast (active dry)",
  "yeast (instant)",
  "agave nectar",
  "honey",
  "maple syrup",
  "molasses",
  "applesauce",
  "bean sprouts (canned)",
  "black olives (canned)",
  "coconut milk",
  "condensed milk",
  "evaporated milk",
  "green olives (canned)",
  "olives (kalamata)",
  "peaches (canned)",
  "pears (canned)",
  "pickles",
  "pineapple (canned)",
  "refried beans",
  "salsa verde",
  "tomato paste",
  "tomato puree",
  "tomato sauce",
  "tuna (canned)",
  "chicken broth",
  "beef",
  "beef broth",
  "vegetable broth",
  "cream of mushroom soup",
  "cream of chicken soup",
  "french onion soup",
  "miso paste",
  "ramen broth",
  "frozen berries",
  "frozen peas",
  "frozen corn",
  "frozen spinach",
  "frozen pizza",
  "ice cream",
  "sorbet",
  "frozen french fries",
  "almond butter",
  "apple sauce cups",
  "beef jerky",
  "candy bars",
  "chocolate bar",
  "cookies",
  "crackers",
  "fruit snacks",
  "granola bars",
  "peanut butter",
  "popcorn",
  "potato chips",
  "pretzels",
  "rice cakes",
  "tortilla chips",
  "bagged cereal",
  "oatmeal",
  "pancake mix",
  "waffles (frozen)",
  "granola",
  "muesli",
  "instant oatmeal",
  "jam (strawberry)",
  "jam (grape)",
  "marmalade",
  "nutella",
  "peanut butter (crunchy)",
  "peanut butter (smooth)",
  "apple juice",
  "black tea",
  "chai tea",
  "chocolate milk",
  "coffee beans",
  "diet soda",
  "energy drinks",
  "fruit punch",
  "green tea",
  "herbal tea",
  "iced tea",
  "lemonade",
  "orange juice",
  "regular soda",
  "sparkling water",
  "sports drinks",
  "tomato juice",
  "vegetable juice",
  "beer (lager)",
  "beer (stout)",
  "brandy",
  "cooking wine",
  "marsala wine",
  "red wine",
  "rum",
  "sherry",
  "white wine",
  "vermouth",
  "tofu (firm)",
  "tofu (silken)",
  "tempeh",
  "seitan",
  "almond milk",
  "coconut cream",
  "coconut water",
  "rice milk",
  "soy milk",
  "oat milk",
  "chickpea flour",
  "masa harina",
  "panko breadcrumbs",
  "regular breadcrumbs",
  "pectin",
  "grits",
  "hominy",
  "kimchi",
  "sauerkraut",
  "hummus",
  "tahini",
  "mustard greens",
  "nori (seaweed)",
  "rice vinegar",
  "asiago",
  "brie",
  "camembert",
  "colby jack",
  "cotija",
  "cream cheese (low fat)",
  "edam",
  "emmental",
  "fontina",
  "gouda",
  "gruyère",
  "havarti",
  "limburger",
  "manchego",
  "mascarpone",
  "monterey jack",
  "muenster",
  "paneer",
  "pecorino",
  "pepper jack",
  "queso fresco",
  "romano",
  "alfalfa sprouts",
  "bean sprouts (fresh)",
  "chayote",
  "green bell pepper",
  "red bell pepper",
  "yellow bell pepper",
  "habanero pepper",
  "serrano pepper",
  "water chestnuts",
  "bamboo shoots",
  "broccolini",
  "red cabbage",
  "napa cabbage",
  "starfruit",
  "rambutan",
  "currants",
  "gooseberry (green or red)",
  "white grape",
  "golden kiwi",
  "muskmelon",
  "blood orange",
  "pink grapefruit",
  "apple (granny smith)",
  "apple (honeycrisp)",
  "apple (golden delicious)",
  "banana (plantain)",
  "banana (cavendish)",
  "papaya (green)",
  "mango (green)",
  "guava (pink)",
  "grapes (red seedless)",
  "grapes (green seedless)",
  "almond flour",
  "coconut flour",
  "rice flour",
  "whole wheat flour",
  "all-purpose flour",
  "self-rising flour",
  "semolina",
  "fenugreek",
  "garam masala",
  "harissa",
  "za'atar",
  "sumac",
  "mace",
  "pumpkin pie spice",
  "italian seasoning",
  "herbes de provence",
  "seasoned salt",
  "poultry seasoning",
  "tajin",
  "creole seasoning",
  "old bay seasoning",
  "aioli",
  "black bean sauce",
  "chimichurri sauce",
  "cocktail sauce",
  "gochujang",
  "guacamole",
  "harissa paste",
  "honey mustard",
  "plum sauce",
  "ponzu sauce",
  "remoulade",
  "tabasco sauce",
  "tzatziki",
  "artichoke hearts (canned)",
  "bamboo shoots (canned)",
  "beets (canned)",
  "chickpeas (canned)",
  "coconut cream (canned)",
  "diced tomatoes (canned)",
  "green beans (canned)",
  "mushrooms (canned)",
  "roasted red peppers (jarred)",
  "sardines (canned)",
  "sweet corn (canned)",
  "pickled beets",
  "pickled jalapeños",
  "pickled onions",
  "sauerkraut (jarred)",
  "kimchi (jarred)",
  "bison",
  "corned beef",
  "pepperoni",
  "salami",
  "tri-tip",
  "venison",
  "chicken tenders",
  "turkey bacon",
  "chicken sausage",
  "turkey sausage",
  "fish sticks (frozen)",
  "imitation crab",
  "pollock",
  "roe",
  "sea bass",
  "snapper",
  "walleye",
  "bologna",
  "deli turkey",
  "deli ham",
  "deli chicken",
  "deli roast beef",
  "pastrami",
  "skim milk",
  "almond milk (unsweetened)",
  "soy milk (unsweetened)",
  "condensed milk (sweetened)",
  "evaporated milk (fat-free)",
  "egg substitute",
  "quail eggs",
  "brownie mix",
  "cake mix",
  "gelatin mix",
  "marshmallows",
  "pudding mix (chocolate)",
  "pudding mix (vanilla)",
  "pie crust (ready-made)",
  "pie filling (cherry)",
  "pie filling (apple)",
  "whipped cream",
  "granola clusters",
  "pita chips",
  "veggie chips",
  "corn chips",
  "rice crackers",
  "ras el hanout",
  "tikka masala sauce",
  "basmati rice",
  "jasmine rice",
  "chapati",
  "gochugaru",
  "furikake",
  "dashi",
  "tamari",
  "mirin",
  "sake (cooking sake)",
  "oyster sauce",
  "rice paper",
  "soba noodles",
  "vietnamese fish sauce",
  "chili garlic sauce",
  "curry leaves",
  "danish pastry",
  "muffin (blueberry)",
  "muffin (chocolate chip)",
  "pound cake",
  "cheesecake",
  "biscotti",
  "doughnut",
  "cinnamon roll",
  "puff pastry",
  "pie crust (homemade)",
  "shortbread cookies",
  "french toast",
  "crepes",
  "toaster pastries",
  "sausage patties",
  "bacon bits",
  "alfredo sauce",
  "carbonara sauce",
  "hollandaise sauce",
  "pesto sauce",
  "sundried tomato pesto",
  "arrabbiata sauce",
  "bolognese sauce",
  "pizza sauce",
  "enchilada sauce",
  "mole sauce",
  "adobo sauce",
  "lemongrass",
  "kaffir lime leaves",
  "chives",
  "sorrel",
  "marjoram",
  "jamaican jerk seasoning",
  "wasabi powder",
  "star anise",
  "stevia",
  "erythritol",
  "xylitol",
  "monk fruit sweetener",
  "barley malt syrup",
  "rice malt syrup",
  "vegetable bouillon",
  "chicken bouillon",
  "beef bouillon",
  "pho broth concentrate",
  "bouillon cubes",
  "meat tenderizer",
  "liquid smoke",
  "food coloring (red)",
  "food coloring (blue)",
  "food coloring (green)",
  "food coloring (yellow)",
  "sprinkles (colored)",
  "candy melts",
  "pimento cheese spread",
  "olive tapenade",
  "baba ganoush",
  "tonnato sauce",
  "cornflakes",
  "bran flakes",
  "raisin bran",
  "rice krispies",
  "frosted flakes",
  "cheerios",
  "lucky charms",
  "veggie burger patties",
  "veggie bacon",
  "veggie sausages",
  "tofurky",
  "vegan cheese",
  "vegan butter",
  "vegan mayonnaise",
  "cashew cheese",
  "shiitake mushrooms",
  "portobello mushrooms",
  "oyster mushrooms",
  "enoki mushrooms",
  "dried apricots",
  "dried cranberries",
  "dried figs",
  "dried dates",
  "raisins",
  "prunes",
  "marcona almonds",
  "poppy seeds",
  "caraway seeds",
  "nigella seeds",
  "capers",
  "cornichons",
  "giardiniera",
  "apple pie",
  "cherry pie",
  "eclair",
  "macarons",
  "macaroons",
  "cupcakes",
  "tiramisu",
  "creme brulee",
  "flan",
  "cannoli",
  "churros",
  "baklava",
  "mousse (chocolate)",
  "fruit tart",
  "pecan pie",
  "edible flowers (nasturtium)",
  "edible flowers (violets)",
  "edible gold leaf",
  "truffle oil",
  "white truffles",
  "black truffles",
  "caviar",
  "foie gras",
  "kombucha",
  "horchata",
  "agua fresca",
  "thai iced tea",
  "bubble tea",
  "apple cider",
  "cassava flour",
  "arrowroot powder",
  "potato flour",
  "teff flour",
  "shaoxing wine",
  "rice wine",
  "white cooking wine",
  "mixed greens",
  "mesclun",
  "microgreens",
  "pea shoots",
  "sprouted grains",
  "chickpea sprouts",
  "lentil sprouts",
  "broccoli sprouts",
  "adzuki beans",
  "fava beans",
  "mung beans",
  "pigeon peas",
  "rotisserie chicken",
  "meatballs (beef)",
  "meatballs (pork)",
  "meatballs (turkey)",
  "falafel",
  "beyond burger",
  "impossible burger",
  "quorn",
  "tvp (textured vegetable protein)",
  "soy crumbles",
  "coconut yogurt",
  "cashew yogurt",
  "oat yogurt",
  "soy yogurt",
  "almond yogurt",
  "just egg (liquid plant-based)",
  "flax egg",
  "aquafaba",
  "cornish hen",
  "quail",
  "goose",
  "grouper",
  "monkfish",
  "flounder",
  "pompano",
  "king mackerel",
  "rainbow trout",
  "stone crab",
  "blue crab",
  "dungeness crab",
  "soft-shell crab",
  "king crab",
  "crayfish",
  "sea urchin",
  "pheasant",
  "rabbit",
  "squirrel",
  "wild boar",
  "candy canes",
  "peppermint bark",
  "chocolate fudge",
  "fruitcake",
  "panettone",
  "gingerbread",
  "halva",
  "turkish delight",
  "mochi",
  "gummy bears",
  "chili crisp",
  "eel sauce",
  "peanut sauce",
  "berbere",
  "tandoori masala",
  "celeriac",
  "salsify",
  "jerusalem artichoke",
  "purslane",
  "taro",
  "ube",
  "lotus root",
  "chanterelle",
  "porcini",
  "maitake",
  "morel",
  "queso dip",
  "spinach artichoke dip",
  "french onion dip",
  "salsa con queso",
  "gelato",
  "frozen custard",
  "sherbet",
  "frozen yogurt",
  "popsicles",
  "slushie",
  "snow cone",
  "date syrup",
  "cane sugar",
  "turbinado sugar",
  "demerara sugar",
  "palm sugar",
  "jaggery",
  "skyr",
  "kefir",
  "labneh",
  "clotted cream",
  "crème fraîche",
  "grapeseed oil",
  "walnut oil",
  "hazelnut oil",
  "pumpkin seed oil",
  "flaxseed oil",
  "champagne vinegar",
  "sherry vinegar",
  "coconut vinegar",
  "fusilli",
  "conchiglie (shell pasta)",
  "tortellini",
  "ravioli",
  "lasagna noodles",
  "cannelloni",
  "cinnamon sticks",
  "peppercorn (green)",
  "peppercorn (pink)",
  "almond extract",
  "lemon extract",
  "peppermint extract",
  "coconut extract",
  "maple extract",
  "banana extract",
  "meringue powder",
  "fondant",
  "marzipan",
  "royal icing",
  "candy coating",
  "arepa",
  "pupusa",
  "roti",
  "focaccia",
  "ciabatta",
  "brioche",
  "lavash",
  "matzo",
  "umeboshi",
  "pickled ginger",
  "pickled garlic",
  "pickled eggs",
  "fermented black beans",
  "fermented tofu",
  "natto",
  "tomato soup",
  "lentil soup",
  "minestrone",
  "chicken noodle soup",
  "vegetable soup",
  "miso soup",
  "clam chowder",
  "gazpacho",
  "borscht",
  "oyster crackers",
  "saltine crackers",
  "graham crackers",
  "water crackers",
  "kale chips",
  "bagel chips",
  "banana chips",
  "plantain chips",
  "cassava chips",
  "protein bar (chocolate)",
  "protein bar (peanut butter)",
  "protein bar (granola type)",
  "protein shake mix",
  "whey protein",
  "casein protein",
  "soy protein",
  "pea protein",
  "hemp protein",
  "egg white protein",
  "gelatin sheets",
  "agar agar",
  "popping boba",
  "tapioca pearls",
  "collagen powder",
  "vital wheat gluten",
  "chocolate chip cookies",
  "oatmeal raisin cookies",
  "sugar cookies",
  "peanut butter cookies",
  "croutons",
  "crisp onions",
  "burrata",
  "oaxaca cheese",
  "queso blanco",
  "apple butter",
  "fruit curd (lemon curd)",
  "speculoos spread",
  "pumpkin pie",
  "key lime pie",
  "chocolate cream pie",
  "meringue pie",
  "shepherd's pie",
  "kvass",
  "seltzer water",
  "tonic water",
  "club soda",
  "edible glitter",
  "candy pearls",
];

export default commonIngredientsArray;
