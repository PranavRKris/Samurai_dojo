var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let loadImage = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

let imagepath = (framenumber, animation) => {
  return "images/" + animation + "/" + framenumber + ".png";
};

let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  backward: [1, 2, 3, 4, 5, 6],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  forward: [1, 2, 3, 4, 5, 6],
};

let loadImages = (callback) => {
  let images = {
    idle: [],
    kick: [],
    punch: [],
    backward: [],
    block: [],
    forward: [],
  };
  let imagestoload = 0;

  ["idle", "kick", "punch", "backward", "block", "forward"].forEach(
    (animation) => {
      let animationframes = frames[animation];
      imagestoload = imagestoload + animationframes.length;

      animationframes.forEach((framenumber) => {
        let path = imagepath(framenumber, animation);

        loadImage(path, (image) => {
          images[animation][framenumber - 1] = image;
          imagestoload = imagestoload - 1;

          if (imagestoload === 0) {
            callback(images);
          }
        });
      });
    }
  );
};

let animate = (ctx, images, animation, callback, size) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, size, 500);
      ctx.drawImage(image, 0, 0, size, 500);
    }, index * 100);
  });
  setTimeout(callback, images[animation].length * 100);
};

size = 500;

loadImages((images) => {
  let queuedanimation = [];

  let aux = () => {
    let selectedanimation;

    if (queuedanimation.length === 0) {
      selectedanimation = "idle";
    } else {
      selectedanimation = queuedanimation.shift();
    }
    animate(ctx, images, selectedanimation, aux, size);
  };
  aux();

  document.getElementById("kick").onclick = () => {
    queuedanimation.push("kick");
  };

  document.getElementById("punch").onclick = () => {
    queuedanimation.push("punch");
  };

  document.getElementById("forward").onclick = () => {
    size = size + 50;
    queuedanimation.push("forward");
  };

  document.getElementById("backward").onclick = () => {
    size = size - 50;
    queuedanimation.push("backward");
  };

  document.getElementById("block").onclick = () => {
    queuedanimation.push("block");
  };

  document.addEventListener("keyup", (event) => {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"

    switch (event.key) {
      case "ArrowLeft":
        size = size - 50;
        queuedanimation.push("backward");
        break;
      case "ArrowRight":
        size = size + 50;
        queuedanimation.push("forward");
        break;
      case "ArrowUp":
        queuedanimation.push("kick");
        break;
      case "ArrowDown":
        queuedanimation.push("punch");
        break;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      queuedanimation.push("block");
    }
  });
});
