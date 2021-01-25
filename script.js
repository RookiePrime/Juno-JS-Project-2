const pokeCards = {};

pokeCards.apiBaseUrl = `https://pokeapi.co/api/v2`;

// There are actually 898 pokemon! But the API is not updated fully for the latest generation
pokeCards.numOfPokemon = 808;

pokeCards.pokemon = {
    name: ``,
    img: ``,
    type: ``,
    moves: [],
    shiny: false
};

// For all the pokemon one might make. And a counter to keep track of all the pokemon in the array.
pokeCards.pokeArray = [];
pokeCards.pokeArrayCount = 0;

// The Pokemon types, and colours associated with those types
pokeCards.pokeTypes = {
    fire: `red`,
    water: `blue`,
    grass: `green`,
    normal: `azure`,
    flying: `cornflowerblue`,
    bug: `chartreuse`,
    electric: `yellow`,
    poison: `purple`,
    rock: `saddlebrown`,
    ground: `burlywood`,
    fairy: `lightpink`,
    ghost: `indigo`,
    dark: `dimgray`,
    dragon: `darkslateblue`,
    steel: `gainsboro`,
    ice: `aqua`,
    psychic: `deeppink`,
    fighting: `indianred`
}

pokeCards.getPokeChoice = choice => {

    // If I have time, this is where I'll be putting a long, odious exception-list. Some pokemon names in the API have some kinda addendum to them; e.g., deoxys-normal, castform-rainy, giratina-altered, etc., and looking up "deoxys" or "giratina" gets you nothing, while looking up "castform" does get you the basic castform. It's confusing.

    if (choice == 0) {
        return `${Math.ceil(Math.random() * pokeCards.numOfPokemon)}`;
    } else {

        return choice;
    }
};

///////////////////////////////////////////
/////////////////////// MAKE CARD /////////
///////////////////////////////////////////
pokeCards.makeCard = data => {
    // The superficial, on-the-page reference for the CSS class of this card. Maybe This applies here? I dunno. The important thing is that THIS works. Also, I 100% recognize that having these two $card things is clunky. I'll fix it if I have time.
    const $cardID = `card-${pokeCards.pokeArrayCount}`;
    // Put a card on the page
    $(`main`).append(`<div class="pokeCard" id="${$cardID}"></div>`);
    const $card = $(`#${$cardID}`);

    // Get started on setting those cards into a nice little spot on the page, like someone's tossing them onto a table with the haphazard abandon of youth.
    pokeCards.animateAndPositionCard($card, $cardID);

    // Put the name in the top
    $card.append(`<h3 class="pokeName">${pokeCards.pokemon.name}</h3>`)

    // Put the picture in the card. And if it's very very lucky, it's a shiny card! This is something that's actually in the regular Pokemon games; every pokemon you encounter has a very, very small chance to be different colours than usual.    

    if (pokeCards.pokemon.shiny) {
        $card.append(`
        <div class="pokePic-container">
            <img src="${pokeCards.pokemon.img}" alt="${pokeCards.pokemon.name}" class="pokePic shiny"></img>
        </div>`);
    } else {
        $card.append(`
        <div class="pokePic-container">
            <img src="${pokeCards.pokemon.img}" alt="${pokeCards.pokemon.name}" class="pokePic"></img>
        </div>`);
    };


    // Colour the card according to type (or types!)
    const type1 = data.types[0].type.name;
    if (data.types.length === 1) {
        $card.css(`background`, `${pokeCards.pokeTypes[type1]}`);
    } else {
        const type2 = data.types[1].type.name;
        $card.css(`background-image`, `linear-gradient(to right, ${pokeCards.pokeTypes[type1]} 50%, ${pokeCards.pokeTypes[type2]} 50%)`)
    }

    // And I need all the info, not just the name and url
    pokeCards.getFullMoveData($cardID);

    $card.append(`<div class="pokeMoves-container pokeMoves-container-${$cardID}"></div>`);

    for (let i = 0; i < pokeCards.pokemon.moves.length; i++) {
        const baseName = pokeCards.pokemon.moves[i].move.name;
        const fixedName = pokeCards.makeNameNice(baseName, i);

        $(`.pokeMoves-container-${$cardID}`).append(`
            <div class="move-${i} move-box ${$cardID}">
                <h2 class="move">${fixedName}</h2>
            </div>
        `);
    };
    pokeCards.pokeArray.push(pokeCards.pokemon);
    pokeCards.pokeArrayCount++;
};

///////////////// ANIMATE AND POSITION CARD //
//////////////////////////////////////////////

pokeCards.animateAndPositionCard = ($card, $cardID) => {
    // Turns out I wanted very particular, slightly different values for these.
    const r = Math.random() * 360;
    const x = Math.random() * 60;
    const y = Math.random() * 40;

    $($card).css(`transform`, `rotate(${r}deg)`).css(`left`, `${x}%`).css(`top`, `${y}%`);
};

///////////////////// MAKE NAME NICE ////////
/////////////////////////////////////////////

pokeCards.makeNameNice = (name, i) => {
    // These are all the moves that are supposed to have dashes in the name. Whoever wrote the names of the moves in the API so that every word had a dash between it is a monster, and I will brook no tolerance of them. This is cancel-culture time, people, this is why we invented tribalism. Vote 'em off the island.
    const dashLists = {
        dashExceptions: [
            `baby-doll-eyes`,
            `double-edge`,
            `freeze-dry`,
            `lock-on`,
            `mud-slap`,
            `multi-attack`,
            `power-up-punch`,
            `self-destruct`,
            `soft-boiled`,
            `topsy-turvy`,
            `trick-or-treat`,
            `u-turn`,
            `v-create`,
            `wake-up slap`,
            `will-o-wisp`,
            `x-scissor`
        ],
        dashCorrections: [
            `Baby-Doll Eyes`,
            `Double-Edge`,
            `Freeze-Dry`,
            `Lock-On`,
            `Mud-Slap`,
            `Multi-Attack`,
            `Power-Up Punch`,
            `Self-Destruct`,
            `Soft-Boiled`,
            `Topsy-Turvy`,
            `Trick-or-Treat`,
            `U-Turn`,
            `V-Create`,
            `Wake-Up Slap`,
            `Will-o-Wisp`,
            `X-Scissor`
        ]};
    // Wrongful dashes, begone! You are not welcome in this place. And may as well begin the next step a l'il early.
    let nameArr = [];

    if (dashLists.dashExceptions.includes(name)) {
        name = dashLists.dashCorrections[dashLists.dashExceptions.indexOf(name)];
    } else {
        nameArr = name.split(`-`).map( (word, i) => word.charAt(0).toUpperCase() + word.slice(1));
        name = nameArr.join(` `);
    }

    pokeCards.pokemon.moves[i].move.name = name;

    return name;
};

//////////////////// GET FULL MOVE DATA /////////
////////////////////////////////////////////////

pokeCards.getFullMoveData = ($cardID) => {

    pokeCards.pokemon.moves.forEach( (move, j) => {
        try {
            $.ajax({
                url: `${pokeCards.pokemon.moves[j].move.url}`,
                method: `GET`,
                dataType: `JSON`
            }).done( data => {
                // Slide out the old one, slide in the new one
                pokeCards.pokemon.moves[j] = data;
                // Add the CSS to make the moves look nice. Four times! Look, JS is hard.
                $(`.move-${j}.${$cardID}`).css(`background-color`, `${pokeCards.pokeTypes[pokeCards.pokemon.moves[j].type.name]}`);
    
            });
        } catch (error) {
            alert(`Oh no! Team Rocket's interfered with the system. Error ${error.responseText}!`);
            // The pokemon probably doesn't have any moves in the API, or something? Well, we don't want the whole thing to bork, so gotta zip up the card so the next one can function.
            pokeCards.pokeArray.push(pokeCards.pokemon);
            pokeCards.pokeArrayCount++;
        };
    });
    // });
};

//////////////////// RANDOM FROM ARRAY /////////
////////////////////////////////////////////////

pokeCards.randoFromArr = arr => Math.floor(Math.random() * arr.length);

//////////////////// RANDOM, NO DUPLICATES //////
/////////////////////////////////////////////////

pokeCards.randoNoDupes = moves => {
    // Generate random number
    // Check if random number is in list already
    // If it is, do nothing; if not, add to list

    while (pokeCards.pokemon.moves.length < 4) {
        const newMove = moves[pokeCards.randoFromArr(moves)];
        if (!pokeCards.pokemon.moves.includes(newMove)) {
            pokeCards.pokemon.moves.push(newMove);
        }
        // And for the dittos, smeargles, wobbuffets of the world, we need an exit
        if (moves.length < 4) {
            break;
        }
    };
};

////////////////////// GET THE POKEMON ////////////
///////////////////////////////////////////////////

pokeCards.getPokemon = (choice) => {
    $.ajax({
        url: `${pokeCards.apiBaseUrl}/pokemon/${pokeCards.getPokeChoice(choice).toLowerCase()}`,
        method: `GET`,
        dataType: `JSON`
    }).done( data => {

        // Fill out the array first
        // Here's the name and the type(s)
        pokeCards.pokemon.name = data.name.replace(data.name[0], data.name[0].toUpperCase());
        pokeCards.pokemon.type = data.types;
        // Put the img in the array
        if (Math.floor(Math.random() * 4096) === 0) {
            pokeCards.pokemon.img = data.sprites[`front_shiny`];
            pokeCards.pokemon.shiny = true;
        } else {
            pokeCards.pokemon.img = data.sprites[`front_default`];
        };
        // Get the moves
        const moves = data.moves;
        // No duplicates allowed! This array gets the move data from the pokemon and puts it in the array. later in the makeCard() function, I get the full details from elsewhere in the API and put them in the array. Refactoring that I wasn't able to fully finish, I would've put the full moves function here if I'd had time.
        pokeCards.randoNoDupes(moves);
        // Then print the card
        pokeCards.makeCard(data);
    }).catch( error => {
        alert(`Oh no! Team Rocket has hacked the computer and stolen all of the ${choice}! Error: ${error.responseText}!`)
    });
};

/////////////////////// FREEZE BUTTON ////
//////////////////////////////////////////

pokeCards.freezeButton = () => {
    // I make sure the button's frozen for two seconds, 'cause I was getting race collision issues otherwise, and putting this in my .done wasn't helping. I dunno. It works this way fine. How fast does anyone need pokemon cards anyway, in this economy?
    $(`.make`).css(`pointer-events`, `none`).css(`background-color`, `gray`).text(`Printing Card...`);
    setTimeout ( () => {
        $(`.make`).css(`pointer-events`, `auto`).css(`background-color`, `white`).text(`Print a Card!`);
    }, 2000);
}

////////////////////// INIT + DOCREADY /////////////
////////////////////////////////////////////////////

pokeCards.init = () => {
    $(`.make`).on(`click`, () => {
    
        pokeCards.freezeButton();

        pokeCards.pokemon = {
            name: ``,
            img: ``,
            type: ``,
            moves: []
        };
        // If you pick a particular pokemon, it is reflected; and if you don't, you get a random one.
        const choice = $(`.pokeName`).val();

        $(`.pokeName`).val(``);
        pokeCards.getPokemon(choice);
    });
    $(`.reset`).on(`click`, () => {
        $(`.card-box`).empty();
        pokeCards.pokeArrayCount = 0;
        pokeCards.pokeArray = [];
        pokeCards.pokemon = {
            name: ``,
            img: ``,
            type: ``,
            moves: []
        };
    });
    // Apparently if you hit Enter in the text field, you refresh the page. This stops that. Somehow? I googled it, it works, clearly there's something to this.
    $(`form`).submit(() => false);
};

$( () => {
    pokeCards.init();
});