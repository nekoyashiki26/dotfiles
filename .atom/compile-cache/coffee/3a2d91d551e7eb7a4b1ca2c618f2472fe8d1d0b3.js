(function() {
  module.exports = function() {
    return atom.contextMenu.add({
      '.tree-view.full-menu .file, .tree-view.full-menu .directory': [
        {
          type: 'separator'
        }, {
          'label': 'Git',
          'submenu': [
            {
              label: 'Git add',
              'command': 'git-plus-context:add'
            }, {
              label: 'Git add + commit',
              'command': 'git-plus-context:add-and-commit'
            }, {
              label: 'Git checkout',
              'command': 'git-plus-context:checkout-file'
            }, {
              label: 'Git diff',
              'command': 'git-plus-context:diff'
            }, {
              label: 'Git diff branches',
              'command': 'git-plus-context:diff-branches'
            }, {
              label: 'Git diff branche files',
              'command': 'git-plus-context:diff-branch-files'
            }, {
              label: 'Git difftool',
              'command': 'git-plus-context:difftool'
            }, {
              label: 'Git pull',
              'command': 'git-plus-context:pull'
            }, {
              label: 'Git push',
              'command': 'git-plus-context:push'
            }, {
              label: 'Git push --set-upstream',
              'command': 'git-plus-context:push-set-upstream'
            }, {
              label: 'Git unstage',
              'command': 'git-plus-context:unstage-file'
            }
          ]
        }, {
          type: 'separator'
        }
      ],
      'atom-text-editor:not(.mini)': [
        {
          'label': 'Git add file',
          'command': 'git-plus:add'
        }
      ]
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9jb250ZXh0LW1lbnUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQTtXQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBakIsQ0FBcUI7TUFDbkIsNkRBQUEsRUFBK0Q7UUFDN0Q7VUFBRSxJQUFBLEVBQU0sV0FBUjtTQUQ2RCxFQUU3RDtVQUFBLE9BQUEsRUFBUyxLQUFUO1VBQ0EsU0FBQSxFQUFXO1lBQ1Q7Y0FDRSxLQUFBLEVBQU8sU0FEVDtjQUVFLFNBQUEsRUFBVyxzQkFGYjthQURTLEVBS1Q7Y0FDRSxLQUFBLEVBQU8sa0JBRFQ7Y0FFRSxTQUFBLEVBQVcsaUNBRmI7YUFMUyxFQVNUO2NBQ0UsS0FBQSxFQUFPLGNBRFQ7Y0FFRSxTQUFBLEVBQVcsZ0NBRmI7YUFUUyxFQWFUO2NBQ0UsS0FBQSxFQUFPLFVBRFQ7Y0FFRSxTQUFBLEVBQVcsdUJBRmI7YUFiUyxFQWlCVDtjQUNFLEtBQUEsRUFBTyxtQkFEVDtjQUVFLFNBQUEsRUFBVyxnQ0FGYjthQWpCUyxFQXFCVDtjQUNFLEtBQUEsRUFBTyx3QkFEVDtjQUVFLFNBQUEsRUFBVyxvQ0FGYjthQXJCUyxFQXlCVDtjQUNFLEtBQUEsRUFBTyxjQURUO2NBRUUsU0FBQSxFQUFXLDJCQUZiO2FBekJTLEVBNkJUO2NBQ0UsS0FBQSxFQUFPLFVBRFQ7Y0FFRSxTQUFBLEVBQVcsdUJBRmI7YUE3QlMsRUFpQ1Q7Y0FDRSxLQUFBLEVBQU8sVUFEVDtjQUVFLFNBQUEsRUFBVyx1QkFGYjthQWpDUyxFQXFDVDtjQUNFLEtBQUEsRUFBTyx5QkFEVDtjQUVFLFNBQUEsRUFBVyxvQ0FGYjthQXJDUyxFQXlDVDtjQUNFLEtBQUEsRUFBTyxhQURUO2NBRUUsU0FBQSxFQUFXLCtCQUZiO2FBekNTO1dBRFg7U0FGNkQsRUFpRDdEO1VBQUUsSUFBQSxFQUFNLFdBQVI7U0FqRDZEO09BRDVDO01Bb0RuQiw2QkFBQSxFQUErQjtRQUM3QjtVQUNFLE9BQUEsRUFBUyxjQURYO1VBRUUsU0FBQSxFQUFXLGNBRmI7U0FENkI7T0FwRFo7S0FBckI7RUFEZTtBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gLT5cbiAgYXRvbS5jb250ZXh0TWVudS5hZGQge1xuICAgICcudHJlZS12aWV3LmZ1bGwtbWVudSAuZmlsZSwgLnRyZWUtdmlldy5mdWxsLW1lbnUgLmRpcmVjdG9yeSc6IFtcbiAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcid9LFxuICAgICAgJ2xhYmVsJzogJ0dpdCcsXG4gICAgICAnc3VibWVudSc6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnR2l0IGFkZCcsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDphZGQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ0dpdCBhZGQgKyBjb21taXQnLFxuICAgICAgICAgICdjb21tYW5kJzogJ2dpdC1wbHVzLWNvbnRleHQ6YWRkLWFuZC1jb21taXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ0dpdCBjaGVja291dCcsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDpjaGVja291dC1maWxlJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgZGlmZicsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDpkaWZmJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgZGlmZiBicmFuY2hlcycsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDpkaWZmLWJyYW5jaGVzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgZGlmZiBicmFuY2hlIGZpbGVzJyxcbiAgICAgICAgICAnY29tbWFuZCc6ICdnaXQtcGx1cy1jb250ZXh0OmRpZmYtYnJhbmNoLWZpbGVzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgZGlmZnRvb2wnLFxuICAgICAgICAgICdjb21tYW5kJzogJ2dpdC1wbHVzLWNvbnRleHQ6ZGlmZnRvb2wnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ0dpdCBwdWxsJyxcbiAgICAgICAgICAnY29tbWFuZCc6ICdnaXQtcGx1cy1jb250ZXh0OnB1bGwnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ0dpdCBwdXNoJyxcbiAgICAgICAgICAnY29tbWFuZCc6ICdnaXQtcGx1cy1jb250ZXh0OnB1c2gnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ0dpdCBwdXNoIC0tc2V0LXVwc3RyZWFtJyxcbiAgICAgICAgICAnY29tbWFuZCc6ICdnaXQtcGx1cy1jb250ZXh0OnB1c2gtc2V0LXVwc3RyZWFtJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgdW5zdGFnZScsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDp1bnN0YWdlLWZpbGUnXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IHR5cGU6ICdzZXBhcmF0b3InfVxuICAgIF0sXG4gICAgJ2F0b20tdGV4dC1lZGl0b3I6bm90KC5taW5pKSc6IFtcbiAgICAgIHtcbiAgICAgICAgJ2xhYmVsJzogJ0dpdCBhZGQgZmlsZSdcbiAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXM6YWRkJ1xuICAgICAgfVxuICAgIF1cbiAgfVxuIl19
