<template>
    <div class="control">
        <label v-if="!!!file"
               for="fileinput" class="control__input">
            <input @change="getFile" type="file" id="fileinput" accept="image/*">
        </label>

        <canvas v-show="!!file"
                :width="canvasWidth"
                :height="canvasHeight*2"
                ref="canvas"
                class="control__canvas"></canvas>

        <template v-if="file">
            <div class="control__label">Brightness</div>

            <div class="control__range">
                <input v-model="range"
                       :style="rangeStyle"
                       type="range" min="-100" max="100" step="1" class="control__range-slider">
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'brightnessControl',

        data() {
            return {
                canvas: '',
                context: {},
                canvasWidth: 600,
                canvasHeight: 314,
                range: 0,
                file: '',
            };
        },

        computed: {
            rangeStyle() {
                const val = (this.range - (-100)) / 200;
                return `background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${val}, #007aff), color-stop(${val}, #a4aab3));`;
            },
        },

        watch: {
            range() {
                this.applyFilter();
            },

            file(newValue) {
                if (newValue) {
                    this.buildCanvas();
                }
            },
        },

        methods: {
            buildCanvas() {
                this.canvas = this.$refs.canvas;
                this.context = this.canvas.getContext('2d');
                const imageObject = new Image();
                const vm = this;

                // Wait until the image loads
                imageObject.onload = () => {
                    vm.context.drawImage(imageObject, 0, 0, this.canvasWidth, this.canvasHeight);
                    vm.applyFilter();
                };
                imageObject.src = this.file;
            },

            applyFilter() {
                const file = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                const fileData = file.data;

                const brightness = this.range * 2.55;
                const multiplier = (255 + brightness) / (255.01 - brightness);

                // Manipulate RGB
                for (let i = 0; i < fileData.length; i += 4) {
                    fileData[i] *= multiplier;
                    fileData[i + 1] *= multiplier;
                    fileData[i + 2] *= multiplier;
                }

                this.context.putImageData(file, 0, this.canvasHeight);
            },

            getFile(e) {
                this.file = URL.createObjectURL(e.target.files[0]);
            },
        },
    };
</script>
