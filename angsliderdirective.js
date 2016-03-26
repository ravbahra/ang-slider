/**
 * Created by rav on 3/25/2016.
 */
app.directive('sliderContainer', ['$window', function($window) {

    return {
        restrict: 'AE',
        controller: function($scope) {
            $scope.carb_protein_slider_pos = 40;
            $scope.protein_fat_slider_pos = 80;

            var minDistance = 10;

            var cWidth = jQuery('.sliders').innerWidth();
            var cLeftOffset = jQuery('.sliders').offset().left;


            this.convertHitToPercentage = function(xPos){
                var percent = (100/cWidth)*(xPos - cLeftOffset);
                return percent;
            }

            var window = angular.element($window);

            window.on('resize', function() {
                cWidth = jQuery('.sliders').innerWidth();
                cLeftOffset = jQuery('.sliders').offset().left;
                //$scope.$apply();
            });




            this.checkCarbProteinPos= function(cpPercent){

                var ok = true;
                if((cpPercent < minDistance)||(cpPercent > ($scope.protein_fat_slider_pos-minDistance))){
                    ok = false
                }
                return ok;
            }



            this.setCarbProteinPercent = function(cpPercent){
                //set the percent and the slider

                var totalCarbProtein = $scope.carb_percent + $scope.protein_percent;

                //slider
                $scope.carb_protein_slider_pos = cpPercent;
                $scope.protein_percent = totalCarbProtein - cpPercent;
                $scope.carb_percent = cpPercent;
                $scope.$apply();
            }

            this.checkProteinFatPos = function(cPercent){
                var ok = true;

                if(cPercent > (100-minDistance) || (cPercent < ($scope.carb_percent + minDistance))){
                    ok = false;
                }


                return ok;
            }
            this.setProteinFatPercent = function(cPercent){
                $scope.protein_fat_slider_pos = cPercent;


                console.log(cPercent);
                $scope.fat_percent = 100-cPercent;
                //var carbAndProtein
                $scope.protein_percent = 100-$scope.fat_percent - $scope.carb_percent;
                //$scope.protein_percent = totalCarbProtein - cpPercent;
                $scope.$apply();
            }


        }
    }

}]);

app.directive('carbProteinSlider', ['$document', function($document) {
    return {
        restrict: 'AE',
        require:"^sliderContainer",
        link: function(scope, element, attr,sliderCont) {

            var clickedX = 0;

            element.on('mousedown', function(event) {
                clickedX = event.pageX;
                $document.on('mousemove', dragslider);
                $document.on('mouseup', stopslidin);
            });

            /*Executes during resize*/
            scope.$watch('containerSize', function() {
                //console.log('asd');
            });

            function dragslider(event) {
                var slid = event.pageX;
                var percentHit = sliderCont.convertHitToPercentage(slid);
                var roundedPos = Math.round(percentHit);

                if(sliderCont.checkCarbProteinPos(roundedPos)){
                    setPosition(roundedPos);
                    sliderCont.setCarbProteinPercent(roundedPos);
                }
            }

            function setPosition(rPercent){
                element.css({left:rPercent+"%"});
            }

            function stopslidin() {
                $document.off('mousemove', dragslider);
                $document.off('mouseup', stopslidin);
            }
        }
    }
}]);

app.directive('proteinFatSlider', ['$document', function($document) {
    return {
        restrict: 'AE',
        require:"^sliderContainer",
        link: function(scope, element, attr,sliderCont) {

            var clickedX = 0;

            element.on('mousedown', function(event) {
                clickedX = event.pageX;
                $document.on('mousemove', dragslider);
                $document.on('mouseup', stopslidin);
            });

            /*Executes during resize*/
            scope.$watch('containerSize', function() {
                //console.log('asd');
            });

            function dragslider(event) {
                var slid = event.pageX;
                var percentHit = sliderCont.convertHitToPercentage(slid);
                var roundedPos = Math.round(percentHit);



                if(sliderCont.checkProteinFatPos(roundedPos)){
                    setPosition(roundedPos);
                    sliderCont.setProteinFatPercent(roundedPos);
                }
            }

            function setPosition(rPercent){
                element.css({left:rPercent+"%"});
            }

            function stopslidin() {
                $document.off('mousemove', dragslider);
                $document.off('mouseup', stopslidin);
            }
        }
    }
}]);