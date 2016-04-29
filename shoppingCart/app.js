var App = angular.module('myApp', ['ngRoute']);    
  

  App.config( function ( $routeProvider ) {
          $routeProvider
             .when( '/', { templateUrl: 'templates/shoppingCart.html',
                              controller: 'shoppingCartCtrl' } );
 });


App.controller('shoppingCartCtrl' ,function($scope, $rootScope, $location) {
    $scope.showModal = false;
    $rootScope.data = data;
    for(var i=0;i<$rootScope.data.productsInCart.length;i++){
        data.productsInCart[i]['p_image'] = 'images/T'+i+'.jpg'
    }
    $scope.total = function() {
        var total = 0;
        angular.forEach($scope.data.productsInCart, function(item) {
            total += item.p_quantity * item.p_price;
        })

        return total;
    }
    $scope.removeItem = function(p_id){
        for(var i=0;i<$rootScope.data.productsInCart.length;i++){
            if($rootScope.data.productsInCart[i]['p_id'] == p_id){
                $rootScope.data.productsInCart.splice(i,1);
                return;
            }
        }
    }
    $scope.editItem = function(p_id){
        $rootScope.p_id = p_id;
        $scope.showModal = true;
        for(var i=0;i<$rootScope.data.productsInCart.length;i++){
            if($rootScope.data.productsInCart[i]['p_id'] == p_id){
              $scope.p_image = $rootScope.data.productsInCart[i]['p_image'];
              $scope.p_name = $rootScope.data.productsInCart[i]['p_name'];
              $scope.p_price =  $rootScope.data.productsInCart[i]['p_price'];
              $scope.availableSizes = {
                                          availableOptions:$rootScope.data.productsInCart[i]['p_available_options']['sizes'],
                                          selectedOption:$rootScope.data.productsInCart[i]['p_selected_size']
                                        };
              $scope.availableData = {
                    availableQtys :[1,2,3,4,5,6,7,8,9],
                    selectedQty :$rootScope.data.productsInCart[i]['p_quantity']
              }

           }
        }
  }

  $scope.updateCart = function(){
    for(var i=0;i<$rootScope.data.productsInCart.length;i++){
      if($rootScope.data.productsInCart[i]['p_id'] == $rootScope.p_id){
        $rootScope.data.productsInCart[i]['p_selected_size'] = $scope.availableSizes.selectedOption;
        $rootScope.data.productsInCart[i]['p_quantity'] = $scope.availableData.selectedQty;
      }
    }

  }

});

App.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog" style="height: 100%;">' + 
            '<div class="modal-content" style="height: 46%;">'+
                '<div class="modal-body">'+
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                '<div style="margin-top: 25px;margin-left: 27px;">'+
                
                    '<span  style="font-size: xx-large;color: #939395;">{{p_name}}</span><br>'+
                    '<span style="font-size: xx-large;color: #444444">{{p_price | currency}}</span><br>'+
                     '<select ng-options="option.name for option in availableSizes.availableOptions track by option.code" ng-model="availableSizes.selectedOption" style="height:33px;font-size:20px;width: 18%;">'+
                       '<option ng-repeat="option in availableSizes.availableOptions" value="{{option.code}" >{{option.name}}</option>'+
                       '</select>&nbsp'+
    '<select ng-options="availableQty for availableQty in availableData.availableQtys" ng-model="availableData.selectedQty" style="height:33px;font-size:20px;width: 9%;"></select><br><br>'+
                      '<button type="button" ng-click="updateCart()" class="btn btn-primary" data-dismiss="modal">ADD TO BAG</button>'+
                    '<img src="{{p_image}}" style="float: right;margin-right: 128px;top: 0px;margin-top: -126px;">'+
               '</div>'+
               '</div>'+
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function(scope, element, attrs) {
          scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });