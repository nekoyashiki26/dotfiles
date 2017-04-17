(function() {
  var AtomGitDiffDetailsView;

  AtomGitDiffDetailsView = require("./git-diff-details-view");

  module.exports = {
    config: {
      closeAfterCopy: {
        type: "boolean",
        "default": false,
        title: "Close diff view after copy"
      },
      keepViewToggled: {
        type: "boolean",
        "default": true,
        title: "Keep view toggled when leaving a diff"
      },
      enableSyntaxHighlighting: {
        type: "boolean",
        "default": false,
        title: "Enable syntax highlighting in diff view"
      },
      showWordDiffs: {
        type: "boolean",
        "default": true,
        title: "Show word diffs"
      }
    },
    activate: function() {
      return atom.workspace.observeTextEditors(function(editor) {
        return new AtomGitDiffDetailsView(editor);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1kaWZmLWRldGFpbHMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxzQkFBQSxHQUF5QixPQUFBLENBQVEseUJBQVI7O0VBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxjQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLEtBQUEsRUFBTyw0QkFGUDtPQURGO01BS0EsZUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxLQUFBLEVBQU8sdUNBRlA7T0FORjtNQVVBLHdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLEtBQUEsRUFBTyx5Q0FGUDtPQVhGO01BZUEsYUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxLQUFBLEVBQU8saUJBRlA7T0FoQkY7S0FERjtJQXFCQSxRQUFBLEVBQVUsU0FBQTthQUNSLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFEO2VBQzVCLElBQUEsc0JBQUEsQ0FBdUIsTUFBdkI7TUFENEIsQ0FBbEM7SUFEUSxDQXJCVjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIkF0b21HaXREaWZmRGV0YWlsc1ZpZXcgPSByZXF1aXJlIFwiLi9naXQtZGlmZi1kZXRhaWxzLXZpZXdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBjbG9zZUFmdGVyQ29weTpcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgdGl0bGU6IFwiQ2xvc2UgZGlmZiB2aWV3IGFmdGVyIGNvcHlcIlxuXG4gICAga2VlcFZpZXdUb2dnbGVkOlxuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIHRpdGxlOiBcIktlZXAgdmlldyB0b2dnbGVkIHdoZW4gbGVhdmluZyBhIGRpZmZcIlxuXG4gICAgZW5hYmxlU3ludGF4SGlnaGxpZ2h0aW5nOlxuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB0aXRsZTogXCJFbmFibGUgc3ludGF4IGhpZ2hsaWdodGluZyBpbiBkaWZmIHZpZXdcIlxuXG4gICAgc2hvd1dvcmREaWZmczpcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICB0aXRsZTogXCJTaG93IHdvcmQgZGlmZnNcIlxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgICAgbmV3IEF0b21HaXREaWZmRGV0YWlsc1ZpZXcoZWRpdG9yKVxuIl19
