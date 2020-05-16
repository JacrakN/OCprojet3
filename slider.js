class Slider {
    constructor(idSlider, idLeftArrow, idRightArrow, idPauseButton, slideClass, stepClass) {
        this.slider = document.getElementById(idSlider);
        this.leftArrow = document.getElementById(idLeftArrow);
        this.rightArrow = document.getElementById(idRightArrow);
        this.pauseButton = document.getElementById(idPauseButton);
        this.slides = document.getElementsByClassName(slideClass);
        this.steps = document.getElementsByClassName(stepClass);
        this.animation = null;
        this.pause = false;
        this.currentSlide = 0;
        this.currentStep = 0;
        this.numberOfSlides = this.slides.length;
        this.numberOfSteps = this.steps.length;
        this.initEvent();
    }
    
    initEvent() {
        this.slides[this.currentSlide].classList.add("active");
        this.steps[this.currentStep].classList.add("color");
        let that = this;
        
        this.animation = setInterval(this.nextItem.bind(this), 5000);
        
        this.rightArrow.addEventListener("click", function(e) {
            that.nextItem();
        });
        
        this.leftArrow.addEventListener("click", function(e) {
            that.previousItem();
        });
        
        this.pauseButton.addEventListener("click", function() {
            if (that.pause) {
                that.animation = setInterval(that.nextItem.bind(that), 5000);
                that.pauseButton.textContent = "||";
            } else {
                clearInterval(that.animation);
                that.pauseButton.textContent = "►";
            }
            that.pause = !that.pause;
        });
        
        document.addEventListener("keydown", function(e) {
            var code = e.keyCode;
            
            if (code == 39) {
                that.nextItem();
            }
            if (code == 37) {
                that.previousItem();
            }
        });
    }
    
    nextItem() {
        this.slides[this.currentSlide].classList.remove("active"); 
        this.steps[this.currentStep].classList.remove("color");
        this.currentSlide++;
        this.currentStep++;
        
        if (this.currentSlide == this.numberOfSlides) {
            this.currentSlide = 0;
        }
        if (this.currentStep == this.numberOfSteps) {
            this.currentStep = 0;
        } 
        this.slides[this.currentSlide].classList.add("active");
        this.steps[this.currentStep].classList.add("color");
    }
    
    previousItem() {
        this.slides[this.currentSlide].classList.remove("active"); 
        this.steps[this.currentStep].classList.remove("color"); 
        this.currentSlide--;
        this.currentStep--;
        
        if (this.currentSlide == - 1) {
            this.currentSlide = this.numberOfSlides - 1;
        }        
        if (this.currentStep == - 1) {
            this.currentStep = this.numberOfSteps - 1;
        }
        this.slides[this.currentSlide].classList.add("active");
        this.steps[this.currentStep].classList.add("color");
    }
}