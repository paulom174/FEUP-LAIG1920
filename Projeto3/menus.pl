:-include('game.pl').
:-include('printBoard.pl').

select_action:-
    read(Action),
    Action > 0,
    Action < 4,
    start_menu_action(Action).

start_menu_action(1):-
    game_menu,
    read(Action),
    Action > 0,
    Action < 4,
    start_game(Action).

start_menu_action(2):-
    print_ruleMenu.

start_menu_action(3):-
    write('EXIT.').

print_menu :-
    write('       ___           ___                       ___           ___      '),nl,
    write('      /\\  \\         /\\  \\          ___        /\\  \\         /\\  \\     '),nl,
    write('      \\:\\  \\       /::\\  \\        /\\  \\      /::\\  \\       /::\\  \\    '),nl,
    write('       \\:\\  \\     /:/\\:\\  \\       \\:\\  \\    /:/\\:\\  \\     /:/\\:\\  \\   '),nl,
    write('       /::\\  \\   /::\\-\\:\\  \\      /::\\__\\  /:/  \\:\\  \\   /:/  \\:\\  \\  '),nl,
    write('      /:/\\:\\__\\ /:/\\:\\ \\:\\__\\  __/:/\\/__/ /:/__/_\\:\\__\\ /:/__/ \\:\\__\\ '),nl,
    write('     /:/  \\/__/ \\/__\\:\\/:/  / /\\/:/  /    \\:\\  /\\ \\/__/ \\:\\  \\ /:/  / '),nl,
    write('    /:/  /           \\::/  /  \\::/__/      \\:\\ \\:\\__\\    \\:\\  /:/  /  '),nl,
    write('    \\/__/            /:/  /    \\:\\__\\       \\:\\/:/  /     \\:\\/:/  /   '),nl,
    write('                    /:/  /      \\/__/        \\::/  /       \\::/  /    '),nl,
    write('                    \\/__/                     \\/__/         \\/__/     '),nl,
    write('    1: Start Game.'),nl,
    write('    2: How to play.'),nl,
    write('    3: Exit Game.'),nl.

game_menu :-
    write('    1: Player Versus Player.'),nl,
    write('    2: Player Versus Bot.'),nl,
    write('    3: Bot Versus Bot.'),nl.

print_ruleMenu:-
    write('Rules').

main:-
    print_menu,
    select_action.