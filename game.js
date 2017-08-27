(function($)
{
  $.fn.game=function()
  {
    do {
      var cell_1= Math.floor(Math.random() * 16) + 1;
      var cell_2= Math.floor(Math.random() * 16) + 1;
    }  while ( cell_1 == cell_2 )

    var randomValue = Math.random() > 0.1 ? 2 : 4;



    $(".grid-row #" + cell_1).html(randomValue);
    $(".grid-row #" + cell_2).html(randomValue);
    //$(".grid-row").children("#"+cell_1).html("2");

    //fonction restart, first mettre tt les cases a zero, puis random les deux premieres valeurs
    function restart(){

      var values = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ];

      for (var r = 1; r <= 4; r++){
        for (var c = 1; c <= 4; c++){
          values[r-1][c-1] == $('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text("");
        }
      }

      do {
        var cell_1= Math.floor(Math.random() * 16) + 1;
        var cell_2= Math.floor(Math.random() * 16) + 1;
      }  while ( cell_1 == cell_2 )

      var randomValue = Math.random() > 0.1 ? 2 : 4;

      $(".grid-row #" + cell_1).html(randomValue);
      $(".grid-row #" + cell_2).html(randomValue);

    }
    //clicker sur le boutton, restart the game.
    $('.button').on('click',function(){
      restart();
    });

    //movement et keyboard
    $(document).on("keydown",function(e){
      var key=e.which;
      switch (key) {
        case 37:
        moveLeft();
        break;

        case 38:
        moveUp();
        break;

        case 39:
        moveRight();
        break;

        case 40:
        moveDown();
        break;
      }
    });

    //chaque tour, un 2 s'ajoute
    function createCell()
    {
      var cell_1= Math.floor(Math.random() * 16) + 1;

      if($(".grid-row").children("#" + cell_1).text() == "" )
      {
        $(".grid-row").children("#" + cell_1).append("2");
      }
      else createCell();
    }

    //check si le jeu est fini ou pas
    function checkGameOver(){
      // Il n'y a plus de cases libres et on ne peut plus faire merge
      if(!cellAvailable() && !canMerge()){
        alert("Game Over");
      }
    }
    //check si on peut encore merge, afin de decider si on fini le jeu
    function canMerge(){


      // verifier si un merge est possible
      var r2, c2;
      for (var r = 1; r <= 4; r++){
        for (var c = 1; c <= 4; c++){

          if(r<4){
            r2 = r+1;
            if($('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text() == $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c + ')').text()){
              return true;
            }
          }

          if(c<4){
            c2 = c + 1;
            if($('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text() == $('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c2 + ')').text()){
              return true;
            }
          }
      }
    }

    return false;
}

    //verifier s il y a encore une case est vide
    function cellAvailable(){
      for (var r = 1; r <= 4; r++){
        for (var c = 1; c <= 4; c++){
          if($('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text() == ""){
            return true;
          }
        }
      }
      return false;
    }


    function moveDown(){
      var values = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ];

      var alreadymerged = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ];

      var score = parseInt($('.score').text());

      var somethingMoved = false;

      // Recuperer les valeurs actuelles dans values[][], deux boucles, une pour row une pour colonne, r c dans HTML c est 1 a 4 mais tableau c est 0 a 3
      for (var r = 1; r <= 4; r++){
        for (var c = 1; c <= 4; c++){
          if($('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text() == ""){
            values[r-1][c-1] = 0;
          } else {
            values[r-1][c-1] = $('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text();
          }
        }
      }

      // Calcul des nouvelles valeurs dans values[][]
      for (var col = 0; col < 4; col++){
        for (var row = 2; row >= 0; row --){

          var saveRow = row;//je sauvegarde le row actuel

          //verifier si on peut additionner: comme c est pour aller vers la bas, row < 3(dernier case) n'est par vide ET (la case a cote =0 ET case 1= case2 ET case 1 n'est pas merged ET case 2 n'est pas merged.
          while (row < 3 && values[row][col] != 0 && (values[row + 1][col] == 0 ||
            (values[row][col] == values[row + 1][col] && alreadymerged[row + 1][col] == 0
              && alreadymerged[row][col] == 0)))
              {
                //case2 est vide, mettre la valeur de case2 a case1, donc case1=case2, ensuite vider la case1
                if (values[row + 1][col] == 0 )
                {
                  values[row + 1][col] = values[row][col];
                  values[row][col] = 0;
                }
                //case2 n'est pas vide, la valeur de case 2 = case1+case2,ensuite vider case1, donc dire case2 est merged
                else
                {
                  values[row + 1][col] = parseInt(values[row + 1][col]) + parseInt(values[row][col]);
                  values[row][col] = 0;
                  alreadymerged[row + 1][col] = 1;

                  score = score + values[row + 1][col];
                }
                row++;//chaque boucle descens la valeur ver case-1,
                somethingMoved = true;
              }
              row = saveRow;//pour optimiser le programme, recommencer par l'endroit ou se trouve la valeur on a traite
            }
          }
          $('.score').text(score);

          // Attribution des nouvelles valeurs
          for (var r2 = 1; r2 <= 4; r2++){
            for (var c2 = 1; c2 <= 4; c2++){
              if(values[r2-1][c2-1] == 0){
                $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c2 + ')').text("");
              } else {
                $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c2 + ')').text(values[r2-1][c2-1]);
              }
            }
          }

          if(somethingMoved){
            createCell();
            checkGameOver();
          }


        }

        function moveUp(){
          var values = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
          ];

          var alreadymerged = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
          ];
          var somethingMoved = false;
          var score = parseInt($('.score').text());
          // Recuperer les valeurs actuelles dans values[][], deux boucles, une pour row une pour colonne, r c dans HTML c est 1 a 4 mais tableau c est 0 a 3
          for (var r = 1; r <= 4; r++){
            for (var c = 1; c <= 4; c++){
              if($('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text() == ""){
                values[r-1][c-1] = 0;//SI
              } else {
                values[r-1][c-1] = $('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text();
              }
            }
          }

          // Calcul des nouvelles valeurs dans values[][]
          for (var col = 0; col < 4; col++){
            for (var row = 1; row <= 3; row ++){

              var saveRow = row;//je sauvegarde le row actuel

              //verifier si on peut additionner
              while (row > 0 && values[row][col] != 0 && (values[row - 1][col] == 0 ||
                (values[row][col] == values[row - 1][col] && alreadymerged[row - 1][col] == 0
                  && alreadymerged[row][col] == 0)))
                  {

                    if (values[row-1][col] == 0 )
                    {
                      values[row - 1][col] = values[row][col];
                      values[row][col] = 0;
                    }

                    else
                    {
                      values[row - 1][col] = parseInt(values[row - 1][col]) + parseInt(values[row][col]);
                      values[row][col] = 0;
                      alreadymerged[row - 1][col] = 1;

                      score = score + values[row - 1][col];
                    }
                    row--;
                    somethingMoved = true;
                  }
                  row = saveRow;//pour optimiser le programme, recommencer par l'endroit ou se trouve la valeur on a traite

                }
              }

              $('.score').text(score);
              // Attribution des nouvelles valeurs
              for (var r2 = 1; r2 <= 4; r2++){
                for (var c2 = 1; c2 <= 4; c2++){
                  if(values[r2-1][c2-1] == 0){
                    $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c2 + ')').text("");
                  } else {
                    $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c2 + ')').text(values[r2-1][c2-1]);
                  }
                }
              }
              if(somethingMoved){
                createCell();
                checkGameOver();
              }

            }

            function moveLeft(){
              var values = [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
              ];

              var alreadymerged = [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
              ];
              var somethingMoved = false;
              var score = parseInt($('.score').text());
              // Recuperer les valeurs actuelles dans values[][], deux boucles, une pour row une pour colonne, r c dans HTML c est 1 a 4 mais tableau c est 0 a 3
              for (var r = 1; r <= 4; r++){
                for (var c = 1; c <= 4; c++){
                  if($('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text() == ""){
                    values[r-1][c-1] = 0;
                  } else {
                    values[r-1][c-1] = $('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text();
                  }
                }
              }

              // Calcul des nouvelles valeurs dans values[][]
              for (var row = 0; row < 4; row ++){
                for (var col = 1; col <=3; col ++){

                  var saveCol = col;//je sauvegarde le col actuel

                  while (col > 0 && values[row][col] != 0 && (values[row][col - 1] == 0 ||
                    (values[row][col] == values[row][col - 1] && alreadymerged[row][col - 1] == 0
                      && alreadymerged[row][col] == 0)))
                      {

                        if (values[row][col - 1] == 0 )
                        {
                          values[row][col - 1] = values[row][col];
                          values[row][col] = 0;
                        }

                        else
                        {
                          values[row][col - 1] = parseInt(values[row][col - 1]) + parseInt(values[row][col]);
                          values[row][col] = 0;
                          alreadymerged[row][col - 1] = 1;

                          score = score + values[row][col - 1];
                        }
                        col--;
                        somethingMoved = true;
                      }
                      col = saveCol;//pour optimiser le programme, recommencer par l'endroit ou se trouve la valeur on a traite
                    }


                  }
                  $('.score').text(score);
                  // Attribution des nouvelles valeurs
                  for (var r2 = 1; r2 <= 4; r2++){
                    for (var c2 = 1; c2 <= 4; c2++){
                      if(values[r2-1][c2-1] == 0){
                        $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c2 + ')').text("");
                      } else {
                        $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c2 + ')').text(values[r2-1][c2-1]);
                      }
                    }
                  }
                  if(somethingMoved){
                    createCell();
                    checkGameOver();
                  }

                }

                function moveRight(){
                  var values = [
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                  ];

                  //on mets les merges qui ont lieu pendant l appel
                  var alreadymerged = [
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                  ];
                  var somethingMoved = false;
                  var score = parseInt($('.score').text());
                  // Recuperer les valeurs actuelles dans values[][], deux boucles, une pour row une pour colonne, r c dans HTML c est 1 a 4 mais tableau c est 0 a 3
                  for (var r = 1; r <= 4; r++){
                    for (var c = 1; c <= 4; c++){
                      if($('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text() == ""){
                        values[r-1][c-1] = 0;
                      } else {
                        values[r-1][c-1] = $('.grid-row:nth-child(' + r + ') .grid-cell:nth-child(' + c + ')').text();
                      }
                    }
                  }

                  // Calcul des nouvelles valeurs dans values[][]
                  for (var row = 0; row < 4; row ++){
                    for (var col = 2; col >=0; col--){

                      var saveCol = col;


                      while (col < 3 && values[row][col] != 0 && (values[row][col + 1] == 0 ||
                        (values[row][col] == values[row][col + 1] && alreadymerged[row][col + 1] == 0
                          && alreadymerged[row][col] == 0)))
                          {

                            if (values[row][col + 1] == 0 )
                            {
                              values[row][col + 1] = values[row][col];
                              values[row][col] = 0;
                            }

                            else
                            {
                              values[row][col + 1] = parseInt(values[row][col + 1]) + parseInt(values[row][col]);
                              values[row][col] = 0;
                              alreadymerged[row][col + 1] = 1;

                              score = score + values[row][col + 1];
                            }
                            col++;//chaque boucle descens la valeur ver case-1,
                            somethingMoved = true;
                          }
                          col = saveCol;//pour optimiser le programme, recommencer par l'endroit ou se trouve la valeur on a traite

                        }


                      }
                      $('.score').text(score);
                      // Attribution des nouvelles valeurs
                      for (var r2 = 1; r2 <= 4; r2++){
                        for (var c2 = 1; c2 <= 4; c2++){
                          if(values[r2-1][c2-1] == 0){
                            $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c2 + ')').text("");
                          } else {
                            $('.grid-row:nth-child(' + r2 + ') .grid-cell:nth-child(' + c2 + ')').text(values[r2-1][c2-1]);
                          }
                        }
                      }
                      if(somethingMoved){
                        createCell();
                        checkGameOver();
                      }
                    }


                  };
                })(jQuery);
