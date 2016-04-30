var shoppingCart = angular.module('shoppingCart', ['ngRoute']);    
  
/* Routing */
shoppingCart.config(function ($routeProvider) {
 $routeProvider
    .when( '/', { templateUrl: 'templates/shoppingCart.html',
                     controller: 'shoppingCartCtrl' } );
});


/* controller for render,edit and remove cart items */
shoppingCart.controller('shoppingCartCtrl' ,function($scope, $rootScope, $location, $window) {
   $scope.showModal = false;
   $rootScope.productData = productData;
   for(var i=0; i<$rootScope.productData.productsInCart.length; i++){
       $rootScope.productData.productsInCart[i]['p_image'] = 'images/T'+i+'.jpg';
   }

   /* calculating total cart items price */
   $scope.total = function() {
       var total = 0;
       angular.forEach($rootScope.productData.productsInCart, function(item) {
           total += item.p_quantity * item.p_price;
       })

       return total;
   };

   /* remove from cart items */
   $scope.removeItem = function(p_id){
       for(var i=0; i<$rootScope.productData.productsInCart.length; i++){
           if($rootScope.productData.productsInCart[i]['p_id'] == p_id){
               $rootScope.productData.productsInCart.splice(i,1);
               return;
           }
       }
   };

   /* click on edit render the data and displaying the popup*/
   $scope.editItem = function(p_id){
       $rootScope.p_id = p_id;
       $scope.showModal = true;
       for(var i=0; i<$rootScope.productData.productsInCart.length; i++){
          if($rootScope.productData.productsInCart[i]['p_id'] == p_id){
             $scope.p_image = $rootScope.productData.productsInCart[i]['p_image'];
             $scope.p_name = $rootScope.productData.productsInCart[i]['p_name'];
             $scope.p_price =  $rootScope.productData.productsInCart[i]['p_price'];
             $scope.availableSizes = {
               availableOptions:$rootScope.productData.productsInCart[i]['p_available_options']['sizes'],
               selectedOption:$rootScope.productData.productsInCart[i]['p_selected_size']
                                       };
             $scope.availableData = {
               availableQtys :[1,2,3,4,5,6,7,8,9],
               selectedQty :$rootScope.productData.productsInCart[i]['p_quantity']
             }
          }
       }
    };

   /* update the cart items */
    $scope.updateCart = function(){
      for(var i=0; i<$rootScope.productData.productsInCart.length; i++){
        if($rootScope.productData.productsInCart[i]['p_id'] == $rootScope.p_id){
          $rootScope.productData.productsInCart[i]['p_selected_size'] = $scope.availableSizes.selectedOption;
          $rootScope.productData.productsInCart[i]['p_quantity'] = $scope.availableData.selectedQty;
        }
      }
    };

    /* reload the cart items */
    $scope.continueShopping = function(){
      $window.location.reload();
    }
});


/*popup for edit screen*/

shoppingCart.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">'+
                '<div class="modal-body">'+
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                '<div class="main-boday">'+
                  '<hr>'+
                      '<p class="p_name">{{p_name}}</p>'+
                      '<p class="p_price">{{p_price | currency}}</p>'+
                       '<select id="available_sizes" ng-options="option.name for option in availableSizes.availableOptions track by option.code" ng-model="availableSizes.selectedOption">'+
                         '<option ng-repeat="option in availableSizes.availableOptions" value="{{option.code}" >{{option.name}}</option>'+
                         '</select>'+
                        '<select id="available_qtys" ng-options="availableQty for availableQty in availableData.availableQtys" ng-model="availableData.selectedQty"></select>'+
                      '<img class="p_image" src="{{p_image}}">'+
                 '</div>'+
                 '<button type="button" ng-click="updateCart()" class="btn btn-primary update-cart" data-dismiss="modal">ADD TO BAG</button>'+
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