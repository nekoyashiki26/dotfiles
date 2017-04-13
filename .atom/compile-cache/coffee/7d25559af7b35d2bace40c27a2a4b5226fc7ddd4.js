(function() {
  var CompositeDisposable, Directory, _os, cpConfigFileName, fs, helpers, path, ref, voucher,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  ref = require('atom'), Directory = ref.Directory, CompositeDisposable = ref.CompositeDisposable;

  _os = null;

  path = null;

  helpers = null;

  voucher = null;

  fs = null;

  cpConfigFileName = '.classpath';

  module.exports = {
    activate: function(state) {
      this.state = state ? state || {} : void 0;
      this.patterns = {
        en: {
          detector: /^\d+ (error|warning)s?$/gm,
          pattern: /^(.*\.java):(\d+): (error|warning): (.+)/,
          translation: {
            'error': 'error',
            'warning': 'warning'
          }
        },
        zh: {
          detector: /^\d+ 个?(错误|警告)$/gm,
          pattern: /^(.*\.java):(\d+): (错误|警告): (.+)/,
          translation: {
            '错误': 'error',
            '警告': 'warning'
          }
        }
      };
      require('atom-package-deps').install('linter-javac');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-javac.javacExecutablePath', (function(_this) {
        return function(newValue) {
          return _this.javaExecutablePath = newValue.trim();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-javac.additionalClasspaths', (function(_this) {
        return function(newValue) {
          return _this.classpath = newValue.trim();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-javac.additionalJavacOptions', (function(_this) {
        return function(newValue) {
          var trimmedValue;
          trimmedValue = newValue.trim();
          if (trimmedValue) {
            return _this.additionalOptions = trimmedValue.split(/\s+/);
          } else {
            return _this.additionalOptions = [];
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-javac.classpathFilename', (function(_this) {
        return function(newValue) {
          return _this.classpathFilename = newValue.trim();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-javac.javacArgsFilename', (function(_this) {
        return function(newValue) {
          return _this.javacArgsFilename = newValue.trim();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-javac.verboseLogging', (function(_this) {
        return function(newValue) {
          return _this.verboseLogging = newValue === true;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    serialize: function() {
      return this.state;
    },
    provideLinter: function() {
      if (_os === null) {
        _os = require('os');
        path = require('path');
        helpers = require('atom-linter');
        voucher = require('voucher');
        fs = require('fs');
        if (this.verboseLogging) {
          this._log('requiring modules finished.');
        }
      }
      if (this.verboseLogging) {
        this._log('providing linter, examining javac-callability.');
      }
      return {
        grammarScopes: ['source.java'],
        scope: 'project',
        lintOnFly: false,
        lint: (function(_this) {
          return function(textEditor) {
            var cp, cpConfig, filePath, lstats, searchDir, wd;
            filePath = textEditor.getPath();
            wd = path.dirname(filePath);
            searchDir = _this.getProjectRootDir() || path.dirname(filePath);
            cp = '';
            if (_this.verboseLogging) {
              _this._log('starting to lint.');
            }
            cpConfig = _this.findClasspathConfig(wd);
            if (cpConfig != null) {
              wd = cpConfig.cfgDir;
              cp = cpConfig.cfgCp;
              searchDir = wd;
            }
            if (_this.classpath) {
              cp += path.delimiter + _this.classpath;
            }
            if (process.env.CLASSPATH) {
              cp += path.delimiter + process.env.CLASSPATH;
            }
            if (_this.verboseLogging) {
              _this._log('start searching java-files with "', searchDir, '" as search-directory.');
            }
            lstats = fs.lstatSync(searchDir);
            return atom.project.repositoryForDirectory(new Directory(searchDir, lstats.isSymbolicLink())).then(function(repo) {
              return _this.getFilesEndingWith(searchDir, '.java', repo != null ? repo.isPathIgnored.bind(repo) : void 0);
            }).then(function(files) {
              var arg, args, cliLimit, expectedCmdSize, j, len, sliceIndex;
              args = ['-Xlint:all'];
              if (cp) {
                args = args.concat(['-cp', cp]);
              }
              if (_this.additionalOptions.length > 0) {
                args = args.concat(_this.additionalOptions);
                if (_this.verboseLogging) {
                  _this._log('adding', _this.additionalOptions.length, 'additional javac-options.');
                }
              }
              if (_this.verboseLogging) {
                _this._log('collected the following arguments:', args.join(' '));
              }
              if (_this.javacArgsFilename) {
                args.push('@' + _this.javacArgsFilename);
                if (_this.verboseLogging) {
                  _this._log('adding', _this.javacArgsFilename, 'as argsfile.');
                }
              }
              args.push.apply(args, files);
              if (_this.verboseLogging) {
                _this._log('adding', files.length, 'files to the javac-arguments (from "', files[0], '" to "', files[files.length - 1], '").');
              }
              cliLimit = _os.platform() === 'win32' ? 7900 : 130000;
              expectedCmdSize = _this.javaExecutablePath.length;
              sliceIndex = 0;
              for (j = 0, len = args.length; j < len; j++) {
                arg = args[j];
                expectedCmdSize++;
                if ((typeof arg) === 'string') {
                  expectedCmdSize += arg.length;
                } else {
                  expectedCmdSize += arg.toString().length;
                }
                if (expectedCmdSize < cliLimit) {
                  sliceIndex++;
                }
              }
              if (sliceIndex < (args.length - 1)) {
                console.warn("linter-javac: The lint-command is presumed to break the limit of " + cliLimit + " characters on the " + (_os.platform()) + "-platform.\nDropping " + (args.length - sliceIndex) + " source files, as a result javac may not resolve all dependencies.");
                args = args.slice(0, sliceIndex);
                args.push(filePath);
              }
              if (_this.verboseLogging) {
                _this._log('calling javac with', args.length, 'arguments by invoking "', _this.javaExecutablePath, '". The approximated command length is', args.join(' ').length, 'characters long, the last argument is:', args[args.length - 1]);
              }
              return helpers.exec(_this.javaExecutablePath, args, {
                stream: 'stderr',
                cwd: wd,
                allowEmptyStderr: true
              }).then(function(val) {
                if (_this.verboseLogging) {
                  _this._log('parsing:\n', val);
                }
                return _this.parse(val, textEditor);
              });
            });
          };
        })(this)
      };
    },
    parse: function(javacOutput, textEditor) {
      var column, file, j, languageCode, lastIndex, len, line, lineNum, lines, match, mess, messages, ref1, type;
      languageCode = this._detectLanguageCode(javacOutput);
      messages = [];
      if (languageCode) {
        if (this.caretRegex == null) {
          this.caretRegex = /^( *)\^/;
        }
        lines = javacOutput.split(/\r?\n/);
        for (j = 0, len = lines.length; j < len; j++) {
          line = lines[j];
          match = line.match(this.patterns[languageCode].pattern);
          if (!!match) {
            ref1 = match.slice(1, 5), file = ref1[0], lineNum = ref1[1], type = ref1[2], mess = ref1[3];
            lineNum--;
            messages.push({
              type: this.patterns[languageCode].translation[type] || 'info',
              text: mess,
              filePath: file,
              range: [[lineNum, 0], [lineNum, 0]]
            });
          } else {
            match = line.match(this.caretRegex);
            if (messages.length > 0 && !!match) {
              column = match[1].length;
              lastIndex = messages.length - 1;
              messages[lastIndex].range[0][1] = column;
              messages[lastIndex].range[1][1] = column + 1;
            }
          }
        }
        if (this.verboseLogging) {
          this._log('returning', messages.length, 'linter-messages.');
        }
      }
      return messages;
    },
    getProjectRootDir: function() {
      var textEditor;
      textEditor = atom.workspace.getActiveTextEditor();
      if (!textEditor || !textEditor.getPath()) {
        if (!atom.project.getPaths().length) {
          return false;
        }
        return atom.project.getPaths()[0];
      }
      return atom.project.getPaths().sort(function(a, b) {
        return b.length - a.length;
      }).find(function(p) {
        var realpath;
        realpath = fs.realpathSync(p);
        return textEditor.getPath().substr(0, realpath.length) === realpath;
      });
    },
    getFilesEndingWith: function(startPath, endsWith, ignoreFn) {
      var folderFiles, foundFiles;
      foundFiles = [];
      folderFiles = [];
      return voucher(fs.readdir, startPath).then(function(files) {
        folderFiles = files;
        return Promise.all(files.map(function(f) {
          var filename;
          filename = path.join(startPath, f);
          return voucher(fs.lstat, filename);
        }));
      }).then((function(_this) {
        return function(fileStats) {
          var mapped;
          mapped = fileStats.map(function(stats, i) {
            var filename;
            filename = path.join(startPath, folderFiles[i]);
            if (typeof ignoreFn === "function" ? ignoreFn(filename) : void 0) {
              return void 0;
            } else if (stats.isDirectory()) {
              return _this.getFilesEndingWith(filename, endsWith, ignoreFn);
            } else if (filename.endsWith(endsWith)) {
              return [filename];
            }
          });
          return Promise.all(mapped.filter(Boolean));
        };
      })(this)).then(function(fileArrays) {
        return [].concat.apply([], fileArrays);
      });
    },
    findClasspathConfig: function(d) {
      var e, file, result;
      while (atom.project.contains(d) || (indexOf.call(atom.project.getPaths(), d) >= 0)) {
        try {
          file = path.join(d, this.classpathFilename);
          result = {
            cfgCp: fs.readFileSync(file, {
              encoding: 'utf-8'
            }),
            cfgDir: d
          };
          result.cfgCp = result.cfgCp.trim();
          return result;
        } catch (error) {
          e = error;
          d = path.dirname(d);
        }
      }
      return null;
    },
    _detectLanguageCode: function(javacOutput) {
      var language, pattern, ref1;
      if (this.verboseLogging) {
        this._log('detecting languages');
      }
      ref1 = this.patterns;
      for (language in ref1) {
        pattern = ref1[language];
        if (javacOutput.match(pattern.detector)) {
          if (this.verboseLogging) {
            this._log('detected the following language-code:', language);
          }
          return language;
        }
      }
      return false;
    },
    _log: function() {
      var javacPrefix, msgs;
      msgs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (msgs.length > 0) {
        javacPrefix = 'linter-javac: ';
        return console.log(javacPrefix + msgs.join(' '));
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qYXZhYy9saWIvaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNGQUFBO0lBQUE7OztFQUFBLE1BQW1DLE9BQUEsQ0FBUSxNQUFSLENBQW5DLEVBQUMseUJBQUQsRUFBWTs7RUFFWixHQUFBLEdBQU07O0VBQ04sSUFBQSxHQUFPOztFQUNQLE9BQUEsR0FBVTs7RUFDVixPQUFBLEdBQVU7O0VBQ1YsRUFBQSxHQUFLOztFQUVMLGdCQUFBLEdBQW1COztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxLQUFELEdBQVksS0FBSCxHQUFjLEtBQUEsSUFBUyxFQUF2QixHQUFBO01BRVQsSUFBQyxDQUFBLFFBQUQsR0FDRTtRQUFBLEVBQUEsRUFDRTtVQUFBLFFBQUEsRUFBVSwyQkFBVjtVQUNBLE9BQUEsRUFBUywwQ0FEVDtVQUVBLFdBQUEsRUFDRTtZQUFBLE9BQUEsRUFBUyxPQUFUO1lBQ0EsU0FBQSxFQUFXLFNBRFg7V0FIRjtTQURGO1FBTUEsRUFBQSxFQUNFO1VBQUEsUUFBQSxFQUFVLG1CQUFWO1VBQ0EsT0FBQSxFQUFTLGtDQURUO1VBRUEsV0FBQSxFQUNFO1lBQUEsSUFBQSxFQUFNLE9BQU47WUFDQSxJQUFBLEVBQU0sU0FETjtXQUhGO1NBUEY7O01BYUYsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsY0FBckM7TUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixrQ0FBcEIsRUFDRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtpQkFDRSxLQUFDLENBQUEsa0JBQUQs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a0IsT0FBTyxDQUFDLFFBQTFCLENBQUg7VUFDRSxJQUFHLElBQUMsQ0FBQSxjQUFKO1lBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBTSx1Q0FBTixFQUErQyxRQUEvQyxFQURGOztBQUVBLGlCQUFPLFNBSFQ7O0FBREY7QUFNQSxhQUFPO0lBVFksQ0E3UnJCO0lBd1NBLElBQUEsRUFBTSxTQUFBO0FBQ0osVUFBQTtNQURLO01BQ0wsSUFBSSxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWxCO1FBQ0UsV0FBQSxHQUFjO2VBQ2QsT0FBTyxDQUFDLEdBQVIsQ0FBWSxXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQTFCLEVBRkY7O0lBREksQ0F4U047O0FBWEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7RGlyZWN0b3J5LCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG4jIHJlcXVpcmUgc3RhdGVtZW50cyB3ZXJlIG1vdmVkIGludG8gdGhlIHByb3ZpZGVMaW50ZXItZnVuY3Rpb25cbl9vcyA9IG51bGxcbnBhdGggPSBudWxsXG5oZWxwZXJzID0gbnVsbFxudm91Y2hlciA9IG51bGxcbmZzID0gbnVsbFxuXG5jcENvbmZpZ0ZpbGVOYW1lID0gJy5jbGFzc3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIHN0YXRlLW9iamVjdCBhcyBwcmVwYXJhdGlvbiBmb3IgdXNlci1ub3RpZmljYXRpb25zXG4gICAgQHN0YXRlID0gaWYgc3RhdGUgdGhlbiBzdGF0ZSBvciB7fVxuICAgICMgbGFuZ3VhZ2UtcGF0dGVybnNcbiAgICBAcGF0dGVybnMgPVxuICAgICAgZW46XG4gICAgICAgIGRldGVjdG9yOiAvXlxcZCsgKGVycm9yfHdhcm5pbmcpcz8kL2dtXG4gICAgICAgIHBhdHRlcm46IC9eKC4qXFwuamF2YSk6KFxcZCspOiAoZXJyb3J8d2FybmluZyk6ICguKykvXG4gICAgICAgIHRyYW5zbGF0aW9uOlxuICAgICAgICAgICdlcnJvcic6ICdlcnJvcidcbiAgICAgICAgICAnd2FybmluZyc6ICd3YXJuaW5nJ1xuICAgICAgemg6XG4gICAgICAgIGRldGVjdG9yOiAvXlxcZCsg5LiqPyjplJnor6986K2m5ZGKKSQvZ21cbiAgICAgICAgcGF0dGVybjogL14oLipcXC5qYXZhKTooXFxkKyk6ICjplJnor6986K2m5ZGKKTogKC4rKS9cbiAgICAgICAgdHJhbnNsYXRpb246XG4gICAgICAgICAgJ+mUmeivryc6ICdlcnJvcidcbiAgICAgICAgICAn6K2m5ZGKJzogJ3dhcm5pbmcnXG5cbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1qYXZhYycpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ2xpbnRlci1qYXZhYy5qYXZhY0V4ZWN1dGFibGVQYXRoJyxcbiAgICAgICAgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgIEBqYXZhRXhlY3V0YWJsZVBhdGggPSBuZXdWYWx1ZS50cmltKClcbiAgICApXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnbGludGVyLWphdmFjLmFkZGl0aW9uYWxDbGFzc3BhdGhzJyxcbiAgICAgICAgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgIEBjbGFzc3BhdGggPSBuZXdWYWx1ZS50cmltKClcbiAgICApXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnbGludGVyLWphdmFjLmFkZGl0aW9uYWxKYXZhY09wdGlvbnMnLFxuICAgICAgICAobmV3VmFsdWUpID0+XG4gICAgICAgICAgdHJpbW1lZFZhbHVlID0gbmV3VmFsdWUudHJpbSgpXG4gICAgICAgICAgaWYgdHJpbW1lZFZhbHVlXG4gICAgICAgICAgICBAYWRkaXRpb25hbE9wdGlvbnMgPSB0cmltbWVkVmFsdWUuc3BsaXQoL1xccysvKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBhZGRpdGlvbmFsT3B0aW9ucyA9IFtdXG4gICAgICApXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnbGludGVyLWphdmFjLmNsYXNzcGF0aEZpbGVuYW1lJyxcbiAgICAgICAgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgIEBjbGFzc3BhdGhGaWxlbmFtZSA9IG5ld1ZhbHVlLnRyaW0oKVxuICAgIClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICdsaW50ZXItamF2YWMuamF2YWNBcmdzRmlsZW5hbWUnLFxuICAgICAgICAobmV3VmFsdWUpID0+XG4gICAgICAgICAgQGphdmFjQXJnc0ZpbGVuYW1lID0gbmV3VmFsdWUudHJpbSgpXG4gICAgKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ2xpbnRlci1qYXZhYy52ZXJib3NlTG9nZ2luZycsXG4gICAgICAgIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICBAdmVyYm9zZUxvZ2dpbmcgPSAobmV3VmFsdWUgPT0gdHJ1ZSlcbiAgICApXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgcmV0dXJuIEBzdGF0ZVxuXG4gIHByb3ZpZGVMaW50ZXI6IC0+XG4gICAgIyBkb2luZyByZXF1aXJlbWVudCBoZXJlIGlzIGxvd2VyaW5nIGxvYWQtdGltZVxuICAgIGlmIF9vcyA9PSBudWxsXG4gICAgICBfb3MgPSByZXF1aXJlICdvcydcbiAgICAgIHBhdGggPSByZXF1aXJlICdwYXRoJ1xuICAgICAgaGVscGVycyA9IHJlcXVpcmUgJ2F0b20tbGludGVyJ1xuICAgICAgdm91Y2hlciA9IHJlcXVpcmUgJ3ZvdWNoZXInXG4gICAgICBmcyA9IHJlcXVpcmUgJ2ZzJ1xuICAgICAgaWYgQHZlcmJvc2VMb2dnaW5nXG4gICAgICAgIEBfbG9nICdyZXF1aXJpbmcgbW9kdWxlcyBmaW5pc2hlZC4nXG5cbiAgICBpZiBAdmVyYm9zZUxvZ2dpbmdcbiAgICAgIEBfbG9nICdwcm92aWRpbmcgbGludGVyLCBleGFtaW5pbmcgamF2YWMtY2FsbGFiaWxpdHkuJ1xuXG4gICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuamF2YSddXG4gICAgc2NvcGU6ICdwcm9qZWN0J1xuICAgIGxpbnRPbkZseTogZmFsc2UgICAgICAgIyBPbmx5IGxpbnQgb24gc2F2ZVxuICAgIGxpbnQ6ICh0ZXh0RWRpdG9yKSA9PlxuICAgICAgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgICAgd2QgPSBwYXRoLmRpcm5hbWUgZmlsZVBhdGhcbiAgICAgIHNlYXJjaERpciA9IEBnZXRQcm9qZWN0Um9vdERpcigpIHx8IHBhdGguZGlybmFtZSBmaWxlUGF0aFxuICAgICAgIyBDbGFzc3BhdGhcbiAgICAgIGNwID0gJydcblxuICAgICAgaWYgQHZlcmJvc2VMb2dnaW5nXG4gICAgICAgIEBfbG9nICdzdGFydGluZyB0byBsaW50LidcblxuICAgICAgIyBGaW5kIHByb2plY3QgY29uZmlnIGZpbGUgaWYgaXQgZXhpc3RzLlxuICAgICAgY3BDb25maWcgPSBAZmluZENsYXNzcGF0aENvbmZpZyh3ZClcbiAgICAgIGlmIGNwQ29uZmlnP1xuICAgICAgICAjIFVzZSB0aGUgbG9jYXRpb24gb2YgdGhlIGNvbmZpZyBmaWxlIGFzIHRoZSB3b3JraW5nIGRpcmVjdG9yeVxuICAgICAgICB3ZCA9IGNwQ29uZmlnLmNmZ0RpclxuICAgICAgICAjIFVzZSBjb25maWd1cmVkIGNsYXNzcGF0aFxuICAgICAgICBjcCA9IGNwQ29uZmlnLmNmZ0NwXG4gICAgICAgICMgVXNlIGNvbmZpZyBmaWxlIGxvY2F0aW9uIHRvIGltcG9ydCBjb3JyZWN0IGZpbGVzXG4gICAgICAgIHNlYXJjaERpciA9IHdkXG5cbiAgICAgICMgQWRkIGV4dHJhIGNsYXNzcGF0aCBpZiBwcm92aWRlZFxuICAgICAgY3AgKz0gcGF0aC5kZWxpbWl0ZXIgKyBAY2xhc3NwYXRoIGlmIEBjbGFzc3BhdGhcblxuICAgICAgIyBBZGQgZW52aXJvbm1lbnQgdmFyaWFibGUgaWYgaXQgZXhpc3RzXG4gICAgICBjcCArPSBwYXRoLmRlbGltaXRlciArIHByb2Nlc3MuZW52LkNMQVNTUEFUSCBpZiBwcm9jZXNzLmVudi5DTEFTU1BBVEhcblxuICAgICAgaWYgQHZlcmJvc2VMb2dnaW5nXG4gICAgICAgIEBfbG9nICdzdGFydCBzZWFyY2hpbmcgamF2YS1maWxlcyB3aXRoIFwiJyxcbiAgICAgICAgICBzZWFyY2hEaXIsXG4gICAgICAgICAgJ1wiIGFzIHNlYXJjaC1kaXJlY3RvcnkuJ1xuXG4gICAgICBsc3RhdHMgPSBmcy5sc3RhdFN5bmMgc2VhcmNoRGlyXG5cbiAgICAgIGF0b20ucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KFxuICAgICAgICBuZXcgRGlyZWN0b3J5KHNlYXJjaERpciwgbHN0YXRzLmlzU3ltYm9saWNMaW5rKCkpXG4gICAgICApXG4gICAgICAgIC50aGVuIChyZXBvKSA9PlxuICAgICAgICAgIEBnZXRGaWxlc0VuZGluZ1dpdGggc2VhcmNoRGlyLFxuICAgICAgICAgICAgJy5qYXZhJywgcmVwbz8uaXNQYXRoSWdub3JlZC5iaW5kKHJlcG8pXG4gICAgICAgIC50aGVuIChmaWxlcykgPT5cbiAgICAgICAgICAjIEFyZ3VtZW50cyB0byBqYXZhY1xuICAgICAgICAgIGFyZ3MgPSBbJy1YbGludDphbGwnXVxuICAgICAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbJy1jcCcsIGNwXSkgaWYgY3BcblxuICAgICAgICAgICMgYWRkIGFkZGl0aW9uYWwgb3B0aW9ucyB0byB0aGUgYXJncy1hcnJheVxuICAgICAgICAgIGlmIEBhZGRpdGlvbmFsT3B0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICBhcmdzID0gYXJncy5jb25jYXQgQGFkZGl0aW9uYWxPcHRpb25zXG4gICAgICAgICAgICBpZiBAdmVyYm9zZUxvZ2dpbmdcbiAgICAgICAgICAgICAgQF9sb2cgJ2FkZGluZycsXG4gICAgICAgICAgICAgICAgQGFkZGl0aW9uYWxPcHRpb25zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAnYWRkaXRpb25hbCBqYXZhYy1vcHRpb25zLidcblxuICAgICAgICAgIGlmIEB2ZXJib3NlTG9nZ2luZ1xuICAgICAgICAgICAgQF9sb2cgJ2NvbGxlY3RlZCB0aGUgZm9sbG93aW5nIGFyZ3VtZW50czonLCBhcmdzLmpvaW4oJyAnKVxuXG4gICAgICAgICAgIyBhZGQgamF2YWMgYXJnc2ZpbGUgaWYgZmlsZW5hbWUgaGFzIGJlZW4gY29uZmlndXJlZFxuICAgICAgICAgIGlmIEBqYXZhY0FyZ3NGaWxlbmFtZVxuICAgICAgICAgICAgYXJncy5wdXNoKCdAJyArIEBqYXZhY0FyZ3NGaWxlbmFtZSlcbiAgICAgICAgICAgIGlmIEB2ZXJib3NlTG9nZ2luZ1xuICAgICAgICAgICAgICBAX2xvZyAnYWRkaW5nJywgQGphdmFjQXJnc0ZpbGVuYW1lLCAnYXMgYXJnc2ZpbGUuJ1xuXG4gICAgICAgICAgYXJncy5wdXNoLmFwcGx5KGFyZ3MsIGZpbGVzKVxuICAgICAgICAgIGlmIEB2ZXJib3NlTG9nZ2luZ1xuICAgICAgICAgICAgQF9sb2cgJ2FkZGluZycsXG4gICAgICAgICAgICAgIGZpbGVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgJ2ZpbGVzIHRvIHRoZSBqYXZhYy1hcmd1bWVudHMgKGZyb20gXCInLFxuICAgICAgICAgICAgICBmaWxlc1swXSxcbiAgICAgICAgICAgICAgJ1wiIHRvIFwiJyxcbiAgICAgICAgICAgICAgZmlsZXNbZmlsZXMubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgJ1wiKS4nXG5cbiAgICAgICAgICAjIFRPRE86IHJlbW92ZSB0aGlzIHF1aWNrIGZpeFxuICAgICAgICAgICMgY291bnQgdGhlIHNpemUgb2YgZXhwZWN0ZWQgZXhlY3V0aW9uLWNvbW1hbmRcbiAgICAgICAgICAjIHNlZSBpc3N1ZSAjNTggZm9yIGZ1cnRoZXIgZGV0YWlsc1xuICAgICAgICAgIGNsaUxpbWl0ID0gaWYgX29zLnBsYXRmb3JtKCkgPT0gJ3dpbjMyJyB0aGVuIDc5MDAgZWxzZSAxMzAwMDBcbiAgICAgICAgICBleHBlY3RlZENtZFNpemUgPSBAamF2YUV4ZWN1dGFibGVQYXRoLmxlbmd0aFxuICAgICAgICAgIHNsaWNlSW5kZXggPSAwXG4gICAgICAgICAgZm9yIGFyZyBpbiBhcmdzXG4gICAgICAgICAgICBleHBlY3RlZENtZFNpemUrKyAjIGFkZCBwcmVwZW5kaW5nIHNwYWNlXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZykgPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgZXhwZWN0ZWRDbWRTaXplICs9IGFyZy5sZW5ndGhcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZXhwZWN0ZWRDbWRTaXplICs9IGFyZy50b1N0cmluZygpLmxlbmd0aFxuICAgICAgICAgICAgaWYgZXhwZWN0ZWRDbWRTaXplIDwgY2xpTGltaXRcbiAgICAgICAgICAgICAgc2xpY2VJbmRleCsrXG5cbiAgICAgICAgICBpZiBzbGljZUluZGV4IDwgKGFyZ3MubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICMgY29mZmVlbGludDogZGlzYWJsZT1tYXhfbGluZV9sZW5ndGhcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiBcIlwiXCJcbiAgbGludGVyLWphdmFjOiBUaGUgbGludC1jb21tYW5kIGlzIHByZXN1bWVkIHRvIGJyZWFrIHRoZSBsaW1pdCBvZiAje2NsaUxpbWl0fSBjaGFyYWN0ZXJzIG9uIHRoZSAje19vcy5wbGF0Zm9ybSgpfS1wbGF0Zm9ybS5cbiAgRHJvcHBpbmcgI3thcmdzLmxlbmd0aCAtIHNsaWNlSW5kZXh9IHNvdXJjZSBmaWxlcywgYXMgYSByZXN1bHQgamF2YWMgbWF5IG5vdCByZXNvbHZlIGFsbCBkZXBlbmRlbmNpZXMuXG4gIFwiXCJcIlxuICAgICAgICAgICAgIyBjb2ZmZWVsaW50OiBlbmFibGU9bWF4X2xpbmVfbGVuZ3RoXG4gICAgICAgICAgICBhcmdzID0gYXJncy5zbGljZSgwLCBzbGljZUluZGV4KSAjIGN1dCBhcmdzIGRvd25cbiAgICAgICAgICAgIGFyZ3MucHVzaChmaWxlUGF0aCkgIyBlbnN1cmUgYWN0dWFsIGZpbGUgaXMgcGFydFxuXG5cbiAgICAgICAgICBpZiBAdmVyYm9zZUxvZ2dpbmdcbiAgICAgICAgICAgIEBfbG9nICdjYWxsaW5nIGphdmFjIHdpdGgnLFxuICAgICAgICAgICAgICBhcmdzLmxlbmd0aCxcbiAgICAgICAgICAgICAgJ2FyZ3VtZW50cyBieSBpbnZva2luZyBcIicsIEBqYXZhRXhlY3V0YWJsZVBhdGgsXG4gICAgICAgICAgICAgICdcIi4gVGhlIGFwcHJveGltYXRlZCBjb21tYW5kIGxlbmd0aCBpcycsXG4gICAgICAgICAgICAgIGFyZ3Muam9pbignICcpLmxlbmd0aCxcbiAgICAgICAgICAgICAgJ2NoYXJhY3RlcnMgbG9uZywgdGhlIGxhc3QgYXJndW1lbnQgaXM6JyxcbiAgICAgICAgICAgICAgYXJnc1thcmdzLmxlbmd0aCAtIDFdXG5cbiAgICAgICAgICAjIEV4ZWN1dGUgamF2YWNcbiAgICAgICAgICBoZWxwZXJzLmV4ZWMoQGphdmFFeGVjdXRhYmxlUGF0aCwgYXJncywge1xuICAgICAgICAgICAgc3RyZWFtOiAnc3RkZXJyJyxcbiAgICAgICAgICAgIGN3ZDogd2QsXG4gICAgICAgICAgICBhbGxvd0VtcHR5U3RkZXJyOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuICh2YWwpID0+XG4gICAgICAgICAgICAgIGlmIEB2ZXJib3NlTG9nZ2luZ1xuICAgICAgICAgICAgICAgIEBfbG9nICdwYXJzaW5nOlxcbicsIHZhbFxuICAgICAgICAgICAgICBAcGFyc2UodmFsLCB0ZXh0RWRpdG9yKVxuXG4gIHBhcnNlOiAoamF2YWNPdXRwdXQsIHRleHRFZGl0b3IpIC0+XG4gICAgbGFuZ3VhZ2VDb2RlID0gQF9kZXRlY3RMYW5ndWFnZUNvZGUgamF2YWNPdXRwdXRcbiAgICBtZXNzYWdlcyA9IFtdXG4gICAgaWYgbGFuZ3VhZ2VDb2RlXG4gICAgICAjIFRoaXMgcmVnZXggaGVscHMgdG8gZXN0aW1hdGUgdGhlIGNvbHVtbiBudW1iZXIgYmFzZWQgb24gdGhlXG4gICAgICAjICAgY2FyZXQgKF4pIGxvY2F0aW9uLlxuICAgICAgQGNhcmV0UmVnZXggPz0gL14oICopXFxeL1xuICAgICAgIyBTcGxpdCBpbnRvIGxpbmVzXG4gICAgICBsaW5lcyA9IGphdmFjT3V0cHV0LnNwbGl0IC9cXHI/XFxuL1xuXG4gICAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgICBtYXRjaCA9IGxpbmUubWF0Y2ggQHBhdHRlcm5zW2xhbmd1YWdlQ29kZV0ucGF0dGVyblxuICAgICAgICBpZiAhIW1hdGNoXG4gICAgICAgICAgW2ZpbGUsIGxpbmVOdW0sIHR5cGUsIG1lc3NdID0gbWF0Y2hbMS4uNF1cbiAgICAgICAgICBsaW5lTnVtLS0gIyBGaXggcmFuZ2UtYmVnaW5uaW5nXG4gICAgICAgICAgbWVzc2FnZXMucHVzaFxuICAgICAgICAgICAgdHlwZTogQHBhdHRlcm5zW2xhbmd1YWdlQ29kZV0udHJhbnNsYXRpb25bdHlwZV0gfHwgJ2luZm8nXG4gICAgICAgICAgICB0ZXh0OiBtZXNzICAgICAgICMgVGhlIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgIGZpbGVQYXRoOiBmaWxlICAgIyBGdWxsIHBhdGggdG8gZmlsZVxuICAgICAgICAgICAgcmFuZ2U6IFtbbGluZU51bSwgMF0sIFtsaW5lTnVtLCAwXV0gIyBTZXQgcmFuZ2UtYmVnaW5uaW5nc1xuICAgICAgICBlbHNlXG4gICAgICAgICAgbWF0Y2ggPSBsaW5lLm1hdGNoIEBjYXJldFJlZ2V4XG4gICAgICAgICAgaWYgbWVzc2FnZXMubGVuZ3RoID4gMCAmJiAhIW1hdGNoXG4gICAgICAgICAgICBjb2x1bW4gPSBtYXRjaFsxXS5sZW5ndGhcbiAgICAgICAgICAgIGxhc3RJbmRleCA9IG1lc3NhZ2VzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgIG1lc3NhZ2VzW2xhc3RJbmRleF0ucmFuZ2VbMF1bMV0gPSBjb2x1bW5cbiAgICAgICAgICAgIG1lc3NhZ2VzW2xhc3RJbmRleF0ucmFuZ2VbMV1bMV0gPSBjb2x1bW4gKyAxXG4gICAgICBpZiBAdmVyYm9zZUxvZ2dpbmdcbiAgICAgICAgQF9sb2cgJ3JldHVybmluZycsIG1lc3NhZ2VzLmxlbmd0aCwgJ2xpbnRlci1tZXNzYWdlcy4nXG5cbiAgICByZXR1cm4gbWVzc2FnZXNcblxuICBnZXRQcm9qZWN0Um9vdERpcjogLT5cbiAgICB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgIXRleHRFZGl0b3IgfHwgIXRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAjIGRlZmF1bHQgdG8gYnVpbGRpbmcgdGhlIGZpcnN0IG9uZSBpZiBubyBlZGl0b3IgaXMgYWN0aXZlXG4gICAgICBpZiBub3QgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkubGVuZ3RoXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cblxuICAgICMgb3RoZXJ3aXNlLCBidWlsZCB0aGUgb25lIGluIHRoZSByb290IG9mIHRoZSBhY3RpdmUgZWRpdG9yXG4gICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgICAuc29ydCgoYSwgYikgLT4gKGIubGVuZ3RoIC0gYS5sZW5ndGgpKVxuICAgICAgLmZpbmQgKHApIC0+XG4gICAgICAgIHJlYWxwYXRoID0gZnMucmVhbHBhdGhTeW5jKHApXG4gICAgICAgICMgVE9ETzogVGhlIGZvbGxvd2luZyBmYWlscyBpZiB0aGVyZSdzIGEgc3ltbGluayBpbiB0aGUgcGF0aFxuICAgICAgICByZXR1cm4gdGV4dEVkaXRvci5nZXRQYXRoKCkuc3Vic3RyKDAsIHJlYWxwYXRoLmxlbmd0aCkgPT0gcmVhbHBhdGhcblxuICBnZXRGaWxlc0VuZGluZ1dpdGg6IChzdGFydFBhdGgsIGVuZHNXaXRoLCBpZ25vcmVGbikgLT5cbiAgICBmb3VuZEZpbGVzID0gW11cbiAgICBmb2xkZXJGaWxlcyA9IFtdXG4gICAgdm91Y2hlciBmcy5yZWFkZGlyLCBzdGFydFBhdGhcbiAgICAgIC50aGVuIChmaWxlcykgLT5cbiAgICAgICAgZm9sZGVyRmlsZXMgPSBmaWxlc1xuICAgICAgICBQcm9taXNlLmFsbCBmaWxlcy5tYXAgKGYpIC0+XG4gICAgICAgICAgZmlsZW5hbWUgPSBwYXRoLmpvaW4gc3RhcnRQYXRoLCBmXG4gICAgICAgICAgdm91Y2hlciBmcy5sc3RhdCwgZmlsZW5hbWVcbiAgICAgIC50aGVuIChmaWxlU3RhdHMpID0+XG4gICAgICAgIG1hcHBlZCA9IGZpbGVTdGF0cy5tYXAgKHN0YXRzLCBpKSA9PlxuICAgICAgICAgIGZpbGVuYW1lID0gcGF0aC5qb2luIHN0YXJ0UGF0aCwgZm9sZGVyRmlsZXNbaV1cbiAgICAgICAgICBpZiBpZ25vcmVGbj8oZmlsZW5hbWUpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgZWxzZSBpZiBzdGF0cy5pc0RpcmVjdG9yeSgpXG4gICAgICAgICAgICByZXR1cm4gQGdldEZpbGVzRW5kaW5nV2l0aCBmaWxlbmFtZSwgZW5kc1dpdGgsIGlnbm9yZUZuXG4gICAgICAgICAgZWxzZSBpZiBmaWxlbmFtZS5lbmRzV2l0aChlbmRzV2l0aClcbiAgICAgICAgICAgIHJldHVybiBbIGZpbGVuYW1lIF1cblxuICAgICAgICBQcm9taXNlLmFsbChtYXBwZWQuZmlsdGVyKEJvb2xlYW4pKVxuXG4gICAgICAudGhlbiAoZmlsZUFycmF5cykgLT5cbiAgICAgICAgW10uY29uY2F0LmFwcGx5KFtdLCBmaWxlQXJyYXlzKVxuXG4gIGZpbmRDbGFzc3BhdGhDb25maWc6IChkKSAtPlxuICAgICMgU2VhcmNoIGZvciB0aGUgLmNsYXNzcGF0aCBmaWxlIHN0YXJ0aW5nIGluIHRoZSBnaXZlbiBkaXJlY3RvcnlcbiAgICAjIGFuZCBzZWFyY2hpbmcgcGFyZW50IGRpcmVjdG9yaWVzIHVudGlsIGl0IGlzIGZvdW5kLCBvciB3ZSBnbyBvdXRzaWRlIHRoZVxuICAgICMgcHJvamVjdCBiYXNlIGRpcmVjdG9yeS5cbiAgICB3aGlsZSBhdG9tLnByb2plY3QuY29udGFpbnMoZCkgb3IgKGQgaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkpXG4gICAgICB0cnlcbiAgICAgICAgZmlsZSA9IHBhdGguam9pbiBkLCBAY2xhc3NwYXRoRmlsZW5hbWVcbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICBjZmdDcDogZnMucmVhZEZpbGVTeW5jKGZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSlcbiAgICAgICAgICBjZmdEaXI6IGRcbiAgICAgICAgcmVzdWx0LmNmZ0NwID0gcmVzdWx0LmNmZ0NwLnRyaW0oKVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICBjYXRjaCBlXG4gICAgICAgIGQgPSBwYXRoLmRpcm5hbWUoZClcblxuICAgIHJldHVybiBudWxsXG5cbiAgX2RldGVjdExhbmd1YWdlQ29kZTogKGphdmFjT3V0cHV0KSAtPlxuICAgIGlmIEB2ZXJib3NlTG9nZ2luZ1xuICAgICAgQF9sb2cgJ2RldGVjdGluZyBsYW5ndWFnZXMnXG4gICAgZm9yIGxhbmd1YWdlLCBwYXR0ZXJuIG9mIEBwYXR0ZXJuc1xuICAgICAgaWYgamF2YWNPdXRwdXQubWF0Y2gocGF0dGVybi5kZXRlY3RvcilcbiAgICAgICAgaWYgQHZlcmJvc2VMb2dnaW5nXG4gICAgICAgICAgQF9sb2cgJ2RldGVjdGVkIHRoZSBmb2xsb3dpbmcgbGFuZ3VhZ2UtY29kZTonLCBsYW5ndWFnZVxuICAgICAgICByZXR1cm4gbGFuZ3VhZ2VcblxuICAgIHJldHVybiBmYWxzZVxuXG4gIF9sb2c6IChtc2dzLi4uKSAtPlxuICAgIGlmIChtc2dzLmxlbmd0aCA+IDApXG4gICAgICBqYXZhY1ByZWZpeCA9ICdsaW50ZXItamF2YWM6ICdcbiAgICAgIGNvbnNvbGUubG9nIGphdmFjUHJlZml4ICsgbXNncy5qb2luKCcgJylcbiJdfQ==
