(function() {
  var backgroundID, cache, changeBackground, clearCache, configChange, currentIndex, disableBackground, enableBackground, filelist, fs, getFilelist, getRandomInt, getType, load, parseDirectory, reloadCache;

  fs = require('fs');

  currentIndex = -1;

  backgroundID = null;

  filelist = [];

  cache = [];

  clearCache = function() {
    return cache = [];
  };

  getType = function(filepath) {
    var stats;
    if (fs.existsSync(filepath)) {
      stats = fs.statSync(filepath);
      if (stats.isFile()) {
        return 'file';
      } else if (stats.isDirectory()) {
        return 'directory';
      }
    }
    return 'unknown';
  };

  getFilelist = function(paths) {
    var filename, filetype, fl, i, len;
    fl = [];
    for (i = 0, len = paths.length; i < len; i++) {
      filename = paths[i];
      filetype = getType(filename);
      if (filetype === 'directory') {
        fl = fl.concat(parseDirectory(filename));
      } else {
        fl.push(filename);
      }
    }
    return fl;
  };

  parseDirectory = function(dirPath) {
    var contents, filename;
    contents = fs.readdirSync(dirPath);
    contents = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = contents.length; i < len; i++) {
        filename = contents[i];
        results.push(dirPath + '/' + filename);
      }
      return results;
    })();
    return getFilelist(contents);
  };

  reloadCache = function() {
    var filename, paths;
    paths = atom.config.get('glass-syntax.backgroundImages');
    filelist = getFilelist(paths);
    return cache = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = filelist.length; i < len; i++) {
        filename = filelist[i];
        results.push(load(filename));
      }
      return results;
    })();
  };

  load = function(filename) {
    var newImage;
    newImage = new Image();
    newImage.src = filename;
    return newImage;
  };

  disableBackground = function() {
    var workspace;
    if (backgroundID !== null) {
      clearInterval(backgroundID);
      currentIndex = -1;
      backgroundID = null;
      workspace = document.querySelector('atom-workspace');
      workspace.style.backgroundImage = '';
      return workspace.style.transition = '';
    }
  };

  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  enableBackground = function(delayTime) {
    if (backgroundID !== null) {
      clearInterval(backgroundID);
    }
    changeBackground();
    return backgroundID = setInterval(changeBackground, delayTime);
  };

  changeBackground = function() {
    var background, newIndex;
    newIndex = currentIndex;
    while (newIndex === currentIndex && filelist.length !== 1) {
      newIndex = getRandomInt(0, filelist.length);
    }
    if (filelist.length === 1) {
      newIndex = 0;
    }
    currentIndex = newIndex;
    background = filelist[currentIndex];
    return document.querySelector('atom-workspace').style.backgroundImage = 'url(' + background + ')';
  };

  configChange = function() {
    var backgrounds, delayTime;
    delayTime = atom.config.get('glass-syntax.delayTime');
    backgrounds = atom.config.get('glass-syntax.backgroundImages');
    if (backgrounds === void 0 || backgrounds.length === 0 || delayTime === void 0) {
      clearCache();
      return disableBackground();
    } else {
      reloadCache();
      return enableBackground(delayTime * 1000);
    }
  };

  module.exports = {
    config: {
      delayTime: {
        title: 'Delay Time',
        description: 'The amount of time between images, in seconds.',
        type: 'number',
        "default": 30,
        minimum: 2
      },
      transitionTime: {
        title: 'Transition Time',
        description: 'The amount of time spent smoothly changing between images, in seconds',
        type: 'number',
        "default": 6,
        minimum: 0
      },
      backgroundImages: {
        title: 'Background Images',
        description: 'The images that will be used as backgrounds, separated by commas. Folder names are accepted, and will be recursively examined for files, there may be non-fatal errors if there are any files that are not images in the folder. Full http and https urls are accepted as well, but will give a blank screen with a fail symbol if the image cannot be found, due to network issues or otherwise. Use "/", not "\\" to separate folders',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      }
    },
    activate: function(state) {
      atom.config.onDidChange('glass-syntax.backgroundImages', function(newValue) {
        return configChange();
      });
      atom.config.onDidChange('glass-syntax.delayTime', function(newValue) {
        return configChange();
      });
      atom.config.observe('glass-syntax.transitionTime', function(newValue) {
        return document.querySelector('atom-workspace').style.transition = 'background-image ' + newValue + 's linear';
      });
      return configChange();
    },
    deactivate: function() {
      clearCache();
      return disableBackground();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dsYXNzLXN5bnRheC9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxZQUFBLEdBQWUsQ0FBQzs7RUFDaEIsWUFBQSxHQUFlOztFQUNmLFFBQUEsR0FBVzs7RUFDWCxLQUFBLEdBQVE7O0VBQ1IsVUFBQSxHQUFhLFNBQUE7V0FDWCxLQUFBLEdBQVE7RUFERzs7RUFHYixPQUFBLEdBQVUsU0FBQyxRQUFEO0FBQ1IsUUFBQTtJQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQUg7TUFDRSxLQUFBLEdBQVEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFaO01BQ1IsSUFBRyxLQUFLLENBQUMsTUFBTixDQUFBLENBQUg7QUFDRSxlQUFPLE9BRFQ7T0FBQSxNQUVLLElBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFIO0FBQ0gsZUFBTyxZQURKO09BSlA7O0FBTUEsV0FBTztFQVBDOztFQVNWLFdBQUEsR0FBYyxTQUFDLEtBQUQ7QUFDWixRQUFBO0lBQUEsRUFBQSxHQUFLO0FBQ0wsU0FBQSx1Q0FBQTs7TUFDRSxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7TUFDWCxJQUFHLFFBQUEsS0FBWSxXQUFmO1FBQ0UsRUFBQSxHQUFLLEVBQUUsQ0FBQyxNQUFILENBQVUsY0FBQSxDQUFlLFFBQWYsQ0FBVixFQURQO09BQUEsTUFBQTtRQUdFLEVBQUUsQ0FBQyxJQUFILENBQVEsUUFBUixFQUhGOztBQUZGO0FBTUEsV0FBTztFQVJLOztFQVVkLGNBQUEsR0FBaUIsU0FBQyxPQUFEO0FBQ2YsUUFBQTtJQUFBLFFBQUEsR0FBVyxFQUFFLENBQUMsV0FBSCxDQUFlLE9BQWY7SUFDWCxRQUFBOztBQUFZO1dBQUEsMENBQUE7O3FC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QUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FIVDtRQUlBLE9BQUEsRUFBUyxDQUpUO09BUEY7TUFZQSxnQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLG1CQUFQO1FBQ0EsV0FBQSxFQUFhLHlhQURiO1FBRUEsSUFBQSxFQUFNLE9BRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBSFQ7UUFJQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUxGO09BYkY7S0FERjtJQXFCQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLCtCQUF4QixFQUF5RCxTQUFDLFFBQUQ7ZUFDdkQsWUFBQSxDQUFBO01BRHVELENBQXpEO01BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHdCQUF4QixFQUFrRCxTQUFDLFFBQUQ7ZUFDaEQsWUFBQSxDQUFBO01BRGdELENBQWxEO01BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDZCQUFwQixFQUFtRCxTQUFDLFFBQUQ7ZUFDakQsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQXdDLENBQUMsS0FBSyxDQUFDLFVBQS9DLEdBQTRELG1CQUFBLEdBQXNCLFFBQXRCLEdBQWlDO01BRDVDLENBQW5EO2FBRUEsWUFBQSxDQUFBO0lBUFEsQ0FyQlY7SUE4QkEsVUFBQSxFQUFZLFNBQUE7TUFDVixVQUFBLENBQUE7YUFDQSxpQkFBQSxDQUFBO0lBRlUsQ0E5Qlo7O0FBbEZGIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcblxuY3VycmVudEluZGV4ID0gLTFcbmJhY2tncm91bmRJRCA9IG51bGxcbmZpbGVsaXN0ID0gW11cbmNhY2hlID0gW11cbmNsZWFyQ2FjaGUgPSAoKSAtPlxuICBjYWNoZSA9IFtdXG5cbmdldFR5cGUgPSAoZmlsZXBhdGgpIC0+XG4gIGlmIGZzLmV4aXN0c1N5bmMgZmlsZXBhdGhcbiAgICBzdGF0cyA9IGZzLnN0YXRTeW5jIGZpbGVwYXRoXG4gICAgaWYgc3RhdHMuaXNGaWxlKClcbiAgICAgIHJldHVybiAnZmlsZSdcbiAgICBlbHNlIGlmIHN0YXRzLmlzRGlyZWN0b3J5KClcbiAgICAgIHJldHVybiAnZGlyZWN0b3J5J1xuICByZXR1cm4gJ3Vua25vd24nXG5cbmdldEZpbGVsaXN0ID0gKHBhdGhzKSAtPlxuICBmbCA9IFtdXG4gIGZvciBmaWxlbmFtZSBpbiBwYXRoc1xuICAgIGZpbGV0eXBlID0gZ2V0VHlwZSBmaWxlbmFtZVxuICAgIGlmIGZpbGV0eXBlIGlzICdkaXJlY3RvcnknXG4gICAgICBmbCA9IGZsLmNvbmNhdChwYXJzZURpcmVjdG9yeSBmaWxlbmFtZSlcbiAgICBlbHNlXG4gICAgICBmbC5wdXNoKGZpbGVuYW1lKVxuICByZXR1cm4gZmxcblxucGFyc2VEaXJlY3RvcnkgPSAoZGlyUGF0aCkgLT5cbiAgY29udGVudHMgPSBmcy5yZWFkZGlyU3luYyhkaXJQYXRoKVxuICBjb250ZW50cyA9IChkaXJQYXRoICsgJy8nICsgZmlsZW5hbWUgZm9yIGZpbGVuYW1lIGluIGNvbnRlbnRzKVxuICByZXR1cm4gZ2V0RmlsZWxpc3QgY29udGVudHNcblxucmVsb2FkQ2FjaGUgPSAoKSAtPlxuICBwYXRocyA9IGF0b20uY29uZmlnLmdldCgnZ2xhc3Mtc3ludGF4LmJhY2tncm91bmRJbWFnZXMnKVxuICBmaWxlbGlzdCA9IGdldEZpbGVsaXN0IHBhdGhzXG4gIGNhY2hlID0gKGxvYWQgZmlsZW5hbWUgZm9yIGZpbGVuYW1lIGluIGZpbGVsaXN0KVxuXG5sb2FkID0gKGZpbGVuYW1lKSAtPlxuICBuZXdJbWFnZSA9IG5ldyBJbWFnZSgpXG4gIG5ld0ltYWdlLnNyYyA9IGZpbGVuYW1lXG4gIHJldHVybiBuZXdJbWFnZVxuXG5kaXNhYmxlQmFja2dyb3VuZCA9ICgpIC0+XG4gIGlmIGJhY2tncm91bmRJRCBpc250IG51bGxcbiAgICBjbGVhckludGVydmFsKGJhY2tncm91bmRJRClcbiAgICBjdXJyZW50SW5kZXggPSAtMVxuICAgIGJhY2tncm91bmRJRCA9IG51bGxcbiAgICB3b3Jrc3BhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXdvcmtzcGFjZScpXG4gICAgd29ya3NwYWNlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICcnXG4gICAgd29ya3NwYWNlLnN0eWxlLnRyYW5zaXRpb24gPSAnJ1xuXG5nZXRSYW5kb21JbnQgPSAobWluLCBtYXgpIC0+XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XG5cbmVuYWJsZUJhY2tncm91bmQgPSAoZGVsYXlUaW1lKSAtPlxuICBpZiBiYWNrZ3JvdW5kSUQgaXNudCBudWxsXG4gICAgY2xlYXJJbnRlcnZhbChiYWNrZ3JvdW5kSUQpXG4gIGNoYW5nZUJhY2tncm91bmQoKVxuICBiYWNrZ3JvdW5kSUQgPSBzZXRJbnRlcnZhbChjaGFuZ2VCYWNrZ3JvdW5kLCBkZWxheVRpbWUpXG5cbmNoYW5nZUJhY2tncm91bmQgPSAoKSAtPlxuICBuZXdJbmRleCA9IGN1cnJlbnRJbmRleFxuICB3aGlsZSBuZXdJbmRleCBpcyBjdXJyZW50SW5kZXggYW5kIGZpbGVsaXN0Lmxlbmd0aCBpc250IDFcbiAgICBuZXdJbmRleCA9IGdldFJhbmRvbUludCgwLCBmaWxlbGlzdC5sZW5ndGgpXG4gIGlmIGZpbGVsaXN0Lmxlbmd0aCBpcyAxXG4gICAgbmV3SW5kZXggPSAwXG4gIGN1cnJlbnRJbmRleCA9IG5ld0luZGV4XG4gIGJhY2tncm91bmQgPSBmaWxlbGlzdFtjdXJyZW50SW5kZXhdXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F0b20td29ya3NwYWNlJykuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnICsgYmFja2dyb3VuZCArICcpJ1xuXG5jb25maWdDaGFuZ2UgPSAoKSAtPlxuICBkZWxheVRpbWUgPSBhdG9tLmNvbmZpZy5nZXQoJ2dsYXNzLXN5bnRheC5kZWxheVRpbWUnKVxuICBiYWNrZ3JvdW5kcyA9IGF0b20uY29uZmlnLmdldCgnZ2xhc3Mtc3ludGF4LmJhY2tncm91bmRJbWFnZXMnKVxuICBpZiBiYWNrZ3JvdW5kcyBpcyB1bmRlZmluZWQgb3IgYmFja2dyb3VuZHMubGVuZ3RoIGlzIDAgb3IgZGVsYXlUaW1lIGlzIHVuZGVmaW5lZFxuICAgIGNsZWFyQ2FjaGUoKVxuICAgIGRpc2FibGVCYWNrZ3JvdW5kKClcbiAgZWxzZVxuICAgIHJlbG9hZENhY2hlKClcbiAgICBlbmFibGVCYWNrZ3JvdW5kKGRlbGF5VGltZSAqIDEwMDApXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGRlbGF5VGltZTpcbiAgICAgIHRpdGxlOiAnRGVsYXkgVGltZSdcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGFtb3VudCBvZiB0aW1lIGJldHdlZW4gaW1hZ2VzLCBpbiBzZWNvbmRzLidcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZWZhdWx0OiAzMFxuICAgICAgbWluaW11bTogMlxuICAgIHRyYW5zaXRpb25UaW1lOlxuICAgICAgdGl0bGU6ICdUcmFuc2l0aW9uIFRpbWUnXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBhbW91bnQgb2YgdGltZSBzcGVudCBzbW9vdGhseSBjaGFuZ2luZyBiZXR3ZWVuIGltYWdlcywgaW4gc2Vjb25kcydcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZWZhdWx0OiA2XG4gICAgICBtaW5pbXVtOiAwXG4gICAgYmFja2dyb3VuZEltYWdlczpcbiAgICAgIHRpdGxlOiAnQmFja2dyb3VuZCBJbWFnZXMnXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBpbWFnZXMgdGhhdCB3aWxsIGJlIHVzZWQgYXMgYmFja2dyb3VuZHMsIHNlcGFyYXRlZCBieSBjb21tYXMuIEZvbGRlciBuYW1lcyBhcmUgYWNjZXB0ZWQsIGFuZCB3aWxsIGJlIHJlY3Vyc2l2ZWx5IGV4YW1pbmVkIGZvciBmaWxlcywgdGhlcmUgbWF5IGJlIG5vbi1mYXRhbCBlcnJvcnMgaWYgdGhlcmUgYXJlIGFueSBmaWxlcyB0aGF0IGFyZSBub3QgaW1hZ2VzIGluIHRoZSBmb2xkZXIuIEZ1bGwgaHR0cCBhbmQgaHR0cHMgdXJscyBhcmUgYWNjZXB0ZWQgYXMgd2VsbCwgYnV0IHdpbGwgZ2l2ZSBhIGJsYW5rIHNjcmVlbiB3aXRoIGEgZmFpbCBzeW1ib2wgaWYgdGhlIGltYWdlIGNhbm5vdCBiZSBmb3VuZCwgZHVlIHRvIG5ldHdvcmsgaXNzdWVzIG9yIG90aGVyd2lzZS4gVXNlIFwiL1wiLCBub3QgXCJcXFxcXCIgdG8gc2VwYXJhdGUgZm9sZGVycydcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdnbGFzcy1zeW50YXguYmFja2dyb3VuZEltYWdlcycsIChuZXdWYWx1ZSkgLT5cbiAgICAgIGNvbmZpZ0NoYW5nZSgpXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2dsYXNzLXN5bnRheC5kZWxheVRpbWUnLCAobmV3VmFsdWUpIC0+XG4gICAgICBjb25maWdDaGFuZ2UoKVxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ2dsYXNzLXN5bnRheC50cmFuc2l0aW9uVGltZScsIChuZXdWYWx1ZSkgLT5cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F0b20td29ya3NwYWNlJykuc3R5bGUudHJhbnNpdGlvbiA9ICdiYWNrZ3JvdW5kLWltYWdlICcgKyBuZXdWYWx1ZSArICdzIGxpbmVhcidcbiAgICBjb25maWdDaGFuZ2UoKVxuXG4gIGRlYWN0aXZhdGU6ICgpIC0+XG4gICAgY2xlYXJDYWNoZSgpXG4gICAgZGlzYWJsZUJhY2tncm91bmQoKVxuIl19
