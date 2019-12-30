:-include('printBoard.pl').
game_over:-
    write('End of Game'),
    break.

play(Board,NewBoard,CurrentPlayer):-
    valid_moves(Board,CurrentPlayer,Moves),
    print_list(Moves,1),
    read(Action),
    do_action(Board,CurrentPlayer,Moves,Action,0,NewBoard),
    printBoard(NewBoard).

do_action(Board,Player,[Head|Tail],N,M,NewBoard):-
    get_split(Head,Y,X),
    get_head(X,X1),
    N=:=(M+1) -> move(Board,[Head|Player],B1), check_hex(B1,X1,Y,Player,NewBoard), check_endgame(NewBoard,Head,Player); true,
    Z is M+1,
    do_action(Board,Player,Tail,N,Z,NewBoard).

check_hex(Board,X,Y,Player,NewBoard):-
    get_Neighbours(X,Y,1,[],Neighbours),
    find_cone(Board,Neighbours,Player,NewBoard).

game_over([Head|Board],Player):-
    get_dir(Board,Head,[]).

% get_dir([Head|Tail],Coords,Dir):-
    

find_cone(NewBoard,[],Player,NewBoard).
find_cone(Board,[Head|Tail],Player,NewBoard):-
    get_split(Head,Y,X),
    get_head(X,X1),
    (check_empty(Board,Y,X1) ->
        (find_hex(Board,X1,Y,1)-> 
            play_cone(Board,Head,B1);
            B1 = Board
        );

        B1 = Board
    ),
    find_cone(B1,Tail,Player,NewBoard).

play_cone(Board,Head,NewBoard):-
    write('Which cone would you like to play?'),nl,
    write('1 - White'),nl,
    write('2 - Black'),nl,
    read(Action),
    Action == 1 -> 
        move(Board,[Head|4],NewBoard); 
        move(Board,[Head|2],NewBoard).

check_empty(Board,Y,X):-
    check_position(Board,X,Y,0,0,Element),
    Element =:= 0.

check_position([Head|Tail],X,Y,N,M,Element):-
    X>=0,Y>=0, !,
    (N =:= Y, M =:= (X+1) -> 
        Element is Head; 

        (N =:= Y ->
            M1 is M+1,
            (M =:= 0 ->
                check_position(Head,X,Y,N,M1,Element); 
                check_position(Tail,X,Y,N,M1,Element)
            );
        N1 is N+1,
        check_position(Tail,X,Y,N1,M,Element)
        )
    ).

find_hex(Board, Col, Row, 7).
find_hex(Board, Col, Row, Dir) :-
    (even(Row) ->
        even_coords(Dir, X, Y); odd_coords(Dir, X, Y)
    ),
    DirN is Dir+1,
    ColN is +(Col,X),
    RowN is +(Row,Y),
    RowN >=0, ColN >= 0, RowN <20, ColN <20, !,
    \+ check_empty(Board,RowN,ColN), !,
    find_hex(Board,Col,Row,DirN).

get_Neighbours(Col, Row, 7, Neighbours, Neighbours).
get_Neighbours(Col, Row, Dir, N, Neighbours) :-
    (even(Row) ->
        even_coords(Dir, X, Y); odd_coords(Dir, X, Y)
    ),
    DirN is Dir+1,
    ColN is +(Col,X),
    RowN is +(Row,Y),
    (\+ member([RowN,ColN],N),RowN >=0,ColN >= 0,RowN <20,ColN <20->
        append(N,[[RowN,ColN]],N1),
        get_Neighbours(Col, Row, DirN, N1, Neighbours);

        get_Neighbours(Col, Row, DirN, N, Neighbours)).
% choose_move(moveNum):-

% check_state(NumPlayers,NextPlayer):-
%     is_game_over(),
%     game_over(),
%     next_play(NumPlayers,NextPlayer)


human_play(Board,NumPlayers,CurrentPlayer,NextPlayer,NumPieces):-
    play(Board,NewBoard,CurrentPlayer),
    next_play(NewBoard,NumPlayers,NextPlayer,NumPieces).

% bot_play(0,CurrentPlayer,NextPlayer):-
%     cpu_move(),
%     printer,
%     check_state(NumPlayers,NextPlayer).

% bot_play(1,CurrentPlayer,NextPlayer):-
%     cpu_move(),
%     printer,
%     check_state(NumPlayers,NextPlayer).
% bot_play(Numplayers,CurrentPlayer,NextPlayer):-
%     cpu_move(),
%     printer,
%     check_state(NumPlayers,NextPlayer).

% next_play(0,CurrentPlayer):-
%     NextPlayer is mod(CurrentPlayer+1,NumPlayers),
%     bot_play(0,CurrentPlayer,NextPlayer).

% next_play(1,CurrentPlayer):-
%     NextPlayer is mod(CurrentPlayer+1,NumPlayers),
%     human_play(1,CurrentPlayer,NextPlayer).
    
next_play(Board,NumPlayers,CurrentPlayer,NumPieces):-
    NumPieces =:= 40 -> game_over; true,
    NextPlayer is mod(CurrentPlayer+1,NumPlayers),
    NextPlayer =< NumPlayers -1,
    NumPieces1 is NumPieces+1,
    human_play(Board,NumPlayers,CurrentPlayer,NextPlayer,NumPieces1).
    % bot_play().

    
% create_players(num,pieces,cones):-
%     (num = 1 -> 
%         Player = [0,pieces,cones,cones]; 
%         Player = [[0,pieces,cones,cones],[1,pieces,cones,cones]]),

% initialize(pieces,cones,0):-
%     board(Board),
%     Bot = [[0,pieces,cones,cones],[1,pieces,cones,cones]]),
%     write(' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\'),
%     nl,
%     printHex(Board,0).

% initialize(pieces,cones,1):-
%     board(Board),
%     Player = [0,pieces,cones,cones],
%     Bot = [0,pieces,cones,cones].
%     write(' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\'),
%     nl,
%     printHex(Board,0).

initialize(Board,Pieces):-
    board(Board),
    printBoard(Board).

start_game(1):-
    initialize(Board,20),
    next_play(Board,2,1,0).
    % (check_position(Board,-1,0,0,0,E)->  Element = E;
    % Element = -1
    % ),
    % format('~p~n',[Element]).
    %check_endgame(Board,[2,1],1).

check_endgame(Board,Coords,Player):-
    (Player =:= 0-> Piece = 1; Piece = 3),
    advance_startpiece(Board,Coords,4,Piece,EndPoint1),
    format('~p~n',[EndPoint1]),
    advance_startpiece(Board,Coords,5,Piece,EndPoint2),
    format('~p~n',[EndPoint2]),
    advance_startpiece(Board,Coords,3,Piece,EndPoint3),
    EndPoint = [[EndPoint1,1],[EndPoint2,2],[EndPoint3,6]],
    (advance_ncells(Board,EndPoint1,1,4,Piece)->
        printBoard(Board),
        game_over;
        true
    ),
    (advance_ncells(Board,EndPoint2,2,4,Piece)->
        printBoard(Board),
        game_over;
        true
    ),
    (advance_ncells(Board,EndPoint3,6,4,Piece)->  
        printBoard(Board),
        game_over;
        true
    ).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).



next_cell(Coords,Dir,Lista):-
    get_split(Coords,Row,Col),
    get_head(Col,Col1),
    (even(Row) ->
        even_coords(Dir, X, Y); odd_coords(Dir, X, Y)
    ),
    ColN is +(Col1,X),
    RowN is +(Row,Y),
    Lista = [RowN,ColN].

advance_ncells(Board,EndPoint,Dir,0,Element). 
advance_ncells(Board,Coords,Dir,N,Element):-
    next_cell(Coords,Dir,Next), !,
    N1 is N-1,
    format('~p~n',[Next]),
    get_split(Next,Y,X),
    get_head(X,X1),
    check_position(Board,X1,Y,0,0,Piece),
    format('~p~n',[[Next,Piece,Element]]),
    % advance_ncells(Board,Next,Dir,N1,Element).
    (Element == Piece ->
        advance_ncells(Board,Next,Dir,N1,Element);

        false
    ).

advance_startpiece([],EndPoint,Dir,Piece,EndPoint). 
advance_startpiece(Board,Coords,Dir,Piece,EndPoint):-
    next_cell(Coords,Dir,Next),
    get_split(Next,Y,X),
    get_head(X,X1),
    (check_position(Board,X1,Y,0,0,E)-> Element = E;
    Element = -1),
    (Element == Piece ->
        %format('a~n',[]),
        advance_startpiece(Board,Next,Dir,Piece,EndPoint);

        format('b~n',[]),
        advance_startpiece([],Coords,Dir,Piece,EndPoint)
    ).

% advance_endpiece([Head|Tail],N,Element):-
%     get_split(Head,Coords,Dir),
%     get_head(Dir,Dir1),
%     advance_ncells(Coords,Dir1,5,EndPoint).



a:-
    start_game(1).

% start_game(2):-
%     initialize(Board,20,5,1),
%     next_play(1,0),


% start_game(3):-
%     initialize(Board,20,5,0),
%     next_play(0,0),

