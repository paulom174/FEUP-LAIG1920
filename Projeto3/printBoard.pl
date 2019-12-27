board([
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]).
initial_board2([
    [0,    0,     0],
    [1,    0,     0],
    [0,    0,     1]
]).

/*pieces symbols*/
/*espaços vazios*/
symbol(0,S) :- S=' '.
/*peças pretas*/
symbol(1,S) :- S='B'. 
/*peças brancas*/
symbol(3,S) :- S='W'. 
/*cones pretos*/
symbol(2,S) :- S='*'. 
/*cones brancos*/
symbol(4,S) :- S='#'. 

even(N):- N/2 =:= N//2.

is_empty(N):- N =:= 0.

init:- 
    board(Board),
    write(' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\'),
    nl,
    printHex(Board,0),
    printer(Board,NewBoard,5),
    nl.

printer(_,_,0).
printer(Board,NewBoard,N):-
    get_moves(Board,Moves),
    print_list(Moves,1),
    read(Action),
    % read(X),
    % read(Y),
    do_action(Board,3,Moves,Action,0,NewBoard),
    % write(' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\'),
    % nl,
    write(' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\'),
    nl,
    printHex(NewBoard,0),
    N1 is N-1,
    printer(NewBoard,NewBoard2,N1).

printBoard(Board):-
    write(' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\'),
    nl,
    printHex(Board,0).

printLine([Head|Tail]):-
    symbol(Head,S),
    write(S),
    write(' | '),
    printLine(Tail).
printLine([]).

printHex([Head|Tail],N):-
    (even(N)->(K is N+1,
            write('| '),
            printLine(Head),
            nl,
            write(' \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\'),
            nl);
            (K is N+1,
            write('  | '),
            printLine(Head),
            nl,
            write(' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ /'),
            nl)),
    printHex(Tail,K).
printHex([],K).    

get_head([H|T], H).

print_list([],_).
print_list([Head|Tail],N):-
    write(N),write(' -> '),
    write(Head),
    nl,
    M is N+1,
    print_list(Tail,M).

divide_list(_, [], Dst, [], Dst).
divide_list(0, Rest, Dst, Rest, Dst).
divide_list(I, [H|T], Tmp, Rest, Dst) :-
    I1 is I-1,
    divide_list(I1, T, [H|Tmp], Rest, Dst).

replace_head([], Element, []).
replace_head([H|T], Element, [Element|T]).

merge_inv_list([], Final, Final).
merge_inv_list([H|T], Rest, Final) :-
    merge_inv_list(T, [H|Rest], Final).

replace_element(I, Element, L, Final) :-
    divide_list(I, L, [], Rest, InvHead),
    replace_head(Rest, Element, NewRest),
    merge_inv_list(InvHead, NewRest, Final).

move(Board,[[Y|X]|Element],NewBoard):-
    get_head(X,X1),
    get_list(Board,Y,Line),
    (Element =:=0 -> Element1 is 1; true),
    (Element =:=1 -> Element1 is 3; true),
    (Element =:=4 -> Element1 is 4; true),
    (Element =:=2 -> Element1 is 2; true),
    replace_element(X1,Element1,Line,NewLine),
    replace_element(Y,NewLine,Board,NewBoard).
    
get_list([Head|Tail],0,Head).
get_list([BoardH|BoardT],Y,Line):-
    Y1 is Y-1,
    get_list(BoardT,Y1,Line).

get_split([H|T], H, T).

odd_coords(1, 1, 0).
odd_coords(2, 1, 1).
odd_coords(3, 0, 1).
odd_coords(4, -1, 0).
odd_coords(5, 0, -1).
odd_coords(6, 1, -1).
odd_coords(_, 0, 0).

even_coords(1, 1, 0).
even_coords(2, 0, 1).
even_coords(3, -1, 1).
even_coords(4, -1, 0).
even_coords(5, -1, -1).
even_coords(6, 0, -1).
even_coords(_, 0, 0).

append_neighbours(Pieces,Col, Row, 7, Neighbours, Neighbours).
append_neighbours(Pieces,Col, Row, Dir, N, Neighbours) :-
    (even(Row) ->
        even_coords(Dir, X, Y); odd_coords(Dir, X, Y)
    ),
    DirN is Dir+1,
    ColN is +(Col,X),
    RowN is +(Row,Y),
    (\+ member([ColN,RowN],Pieces), \+ member([RowN,ColN],N),RowN >=0,ColN >= 0,RowN <20,ColN <20->
        append(N,[[RowN,ColN]],N1),
        append_neighbours(Pieces,Col, Row, DirN, N1, Neighbours);

        append_neighbours(Pieces,Col, Row, DirN, N, Neighbours)).

loop_pieces([],Pieces,Moves,Moves).
loop_pieces([Head|Tail],Pieces,Aux,Moves):-
    %ler as peças já jogadas e obter todas as posições possiveis para a próxima jogada
    get_split(Head,X,Y),
    append_neighbours(Pieces,X,Y,1,[],Neighbours),
    %print_list(Neighbours,0),
    append(Aux,Neighbours,Aux2),
    loop_pieces(Tail,Pieces,Aux2,Moves).

valid_moves(Board,Player,Moves):-
    get_pieces(Board,Pieces),
    loop_pieces(Pieces,Pieces,[],Aux),
    sort(Aux,Moves).

get_pieces(Board,Pieces):-
    get_line(Board,0,0,[],Pieces).

get_col([],N,M,Pieces,Pieces).
get_col([Head|Tail],N,M,P,Pieces):-
    (\+ is_empty(Head)->
        append(P,[[M,N]],P1), 
        K is M+1,
        get_col(Tail,N,K,P1,Pieces); 

        K is M+1,
        get_col(Tail,N,K,P,Pieces)
    ).

get_line([],N,M,Pieces,Pieces).
get_line([Head|Tail],N,M,P,Pieces):-
    get_col(Head,N,M,[],PiecesAux),
    append(P,PiecesAux,P1),
    J is N+1,
    get_line(Tail,J,M,P1,Pieces).

