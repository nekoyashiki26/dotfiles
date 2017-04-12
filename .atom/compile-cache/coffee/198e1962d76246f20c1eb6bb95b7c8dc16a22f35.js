(function() {
  module.exports = {
    autoToggle: {
      title: "Auto Toggle",
      description: "Toggle on start.",
      type: "boolean",
      "default": true
    },
    comboMode: {
      type: "object",
      properties: {
        enabled: {
          title: "Combo Mode - Enabled",
          description: "When enabled effects won't appear until reach the activation threshold.",
          type: "boolean",
          "default": true,
          order: 1
        },
        activationThreshold: {
          title: "Combo Mode - Activation Threshold",
          description: "Streak threshold to activate the power mode.",
          type: "integer",
          "default": 50,
          minimum: 1,
          maximum: 1000
        },
        streakTimeout: {
          title: "Combo Mode - Streak Timeout",
          description: "Timeout to reset the streak counter. In seconds.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationEvery: {
          title: "Combo Mode - Exclamation Every",
          description: "Shows an exclamation every streak count.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationTexts: {
          title: "Combo Mode - Exclamation Texts",
          description: "Exclamations to show (randomized).",
          type: "array",
          "default": ["Super!", "Radical!", "Fantastic!", "Great!", "OMG", "Whoah!", ":O", "Nice!", "Splendid!", "Wild!", "Grand!", "Impressive!", "Stupendous!", "Extreme!", "Awesome!"]
        },
        opacity: {
          title: "Combo Mode - Opacity",
          description: "Opacity of the streak counter.",
          type: "number",
          "default": 0.6,
          minimum: 0,
          maximum: 1
        }
      }
    },
    screenShake: {
      type: "object",
      properties: {
        minIntensity: {
          title: "Screen Shake - Minimum Intensity",
          description: "The minimum (randomized) intensity of the shake.",
          type: "integer",
          "default": 1,
          minimum: 0,
          maximum: 100
        },
        maxIntensity: {
          title: "Screen Shake - Maximum Intensity",
          description: "The maximum (randomized) intensity of the shake.",
          type: "integer",
          "default": 3,
          minimum: 0,
          maximum: 100
        },
        enabled: {
          title: "Screen Shake - Enabled",
          description: "Turn the shaking on/off.",
          type: "boolean",
          "default": true
        }
      }
    },
    playAudio: {
      type: "object",
      properties: {
        enabled: {
          title: "Play Audio - Enabled",
          description: "Play audio clip on/off.",
          type: "boolean",
          "default": false,
          order: 1
        },
        audioclip: {
          title: "Play Audio - Audioclip",
          description: "Which audio clip played at keystroke.",
          type: "string",
          "default": '../audioclips/gun.wav',
          "enum": [
            {
              value: '../audioclips/gun.wav',
              description: 'Gun'
            }, {
              value: '../audioclips/typewriter.wav',
              description: 'Type Writer'
            }, {
              value: 'customAudioclip',
              description: 'Custom Path'
            }
          ],
          order: 3
        },
        customAudioclip: {
          title: "Play Audio - Path to Audioclip",
          description: "Path to audioclip played at keystroke.",
          type: "string",
          "default": 'rocksmash.wav',
          order: 4
        },
        volume: {
          title: "Play Audio - Volume",
          description: "Volume of the audio clip played at keystroke.",
          type: "number",
          "default": 0.42,
          minimum: 0.0,
          maximum: 1.0,
          order: 2
        }
      }
    },
    particles: {
      type: "object",
      properties: {
        enabled: {
          title: "Particles - Enabled",
          description: "Turn the particles on/off.",
          type: "boolean",
          "default": true,
          order: 1
        },
        colours: {
          type: "object",
          properties: {
            type: {
              title: "Colours",
              description: "Configure colour options",
              type: "string",
              "default": "cursor",
              "enum": [
                {
                  value: 'cursor',
                  description: 'Particles will be the colour at the cursor.'
                }, {
                  value: 'random',
                  description: 'Particles will have random colours.'
                }, {
                  value: 'fixed',
                  description: 'Particles will have a fixed colour.'
                }
              ],
              order: 1
            },
            fixed: {
              title: "Fixed colour",
              description: "Colour when fixed colour is selected",
              type: "color",
              "default": "#fff"
            }
          }
        },
        totalCount: {
          type: "object",
          properties: {
            max: {
              title: "Particles - Max Total",
              description: "The maximum total number of particles on the screen.",
              type: "integer",
              "default": 500,
              minimum: 0
            }
          }
        },
        spawnCount: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Spawned",
              description: "The minimum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 5
            },
            max: {
              title: "Particles - Maximum Spawned",
              description: "The maximum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 15
            }
          }
        },
        size: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Size",
              description: "The minimum (randomized) size of the particles.",
              type: "integer",
              "default": 2,
              minimum: 0
            },
            max: {
              title: "Particles - Maximum Size",
              description: "The maximum (randomized) size of the particles.",
              type: "integer",
              "default": 4,
              minimum: 0
            }
          }
        }
      }
    },
    excludedFileTypes: {
      type: "object",
      properties: {
        excluded: {
          title: "Prohibit activate-power-mode from enabling on these file types:",
          description: "Use comma separated, lowercase values (i.e. \"html, cpp, css\")",
          type: "array",
          "default": ["."]
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NvbmZpZy1zY2hlbWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFVBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxhQUFQO01BQ0EsV0FBQSxFQUFhLGtCQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7S0FERjtJQU1BLFNBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxRQUFOO01BQ0EsVUFBQSxFQUNFO1FBQUEsT0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLHNCQUFQO1VBQ0EsV0FBQSxFQUFhLHlFQURiO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7VUFJQSxLQUFBLEVBQU8sQ0FKUDtTQURGO1FBT0EsbUJBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxtQ0FBUDtVQUNBLFdBQUEsRUFBYSw4Q0FEYjtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUhUO1VBSUEsT0FBQSxFQUFTLENBSlQ7VUFLQSxPQUFBLEVBQVMsSUFMVDtTQVJGO1FBZUEsYUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLDZCQUFQO1VBQ0EsV0FBQSxFQUFhLGtEQURiO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBSFQ7VUFJQSxPQUFBLEVBQVMsQ0FKVDtVQUtBLE9BQUEsRUFBUyxHQUxUO1NBaEJGO1FBdUJBLGdCQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sZ0NBQVA7VUFDQSxXQUFBLEVBQWEsMENBRGI7VUFFQSxJQUFBLEVBQU0sU0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtV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QUEsSUFBQSxFQUFNLFFBQU47VUFDQSxVQUFBLEVBQ0U7WUFBQSxHQUFBLEVBQ0U7Y0FBQSxLQUFBLEVBQU8sNkJBQVA7Y0FDQSxXQUFBLEVBQWEsZ0VBRGI7Y0FFQSxJQUFBLEVBQU0sU0FGTjtjQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FIVDthQURGO1lBTUEsR0FBQSxFQUNFO2NBQUEsS0FBQSxFQUFPLDZCQUFQO2NBQ0EsV0FBQSxFQUFhLGdFQURiO2NBRUEsSUFBQSxFQUFNLFNBRk47Y0FHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBSFQ7YUFQRjtXQUZGO1NBdkNGO1FBcURBLElBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1VBQ0EsVUFBQSxFQUNFO1lBQUEsR0FBQSxFQUNFO2NBQUEsS0FBQSxFQUFPLDBCQUFQO2NBQ0EsV0FBQSxFQUFhLGlEQURiO2NBRUEsSUFBQSxFQUFNLFNBRk47Y0FHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBSFQ7Y0FJQSxPQUFBLEVBQVMsQ0FKVDthQURGO1lBT0EsR0FBQSxFQUNFO2NBQUEsS0FBQSxFQUFPLDBCQUFQO2NBQ0EsV0FBQSxFQUFhLGlEQURiO2NBRUEsSUFBQSxFQUFNLFNBRk47Y0FHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBSFQ7Y0FJQSxPQUFBLEVBQVMsQ0FKVDthQVJGO1dBRkY7U0F0REY7T0FGRjtLQXRIRjtJQThMQSxpQkFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFFBQU47TUFDQSxVQUFBLEVBQ0U7UUFBQSxRQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8saUVBQVA7VUFDQSxXQUFBLEVBQWEsaUVBRGI7VUFFQSxJQUFBLEVBQU0sT0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxHQUFELENBSFQ7U0FERjtPQUZGO0tBL0xGOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBhdXRvVG9nZ2xlOlxuICAgIHRpdGxlOiBcIkF1dG8gVG9nZ2xlXCJcbiAgICBkZXNjcmlwdGlvbjogXCJUb2dnbGUgb24gc3RhcnQuXCJcbiAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIGRlZmF1bHQ6IHRydWVcblxuICBjb21ib01vZGU6XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBlbmFibGVkOlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIldoZW4gZW5hYmxlZCBlZmZlY3RzIHdvbid0IGFwcGVhciB1bnRpbCByZWFjaCB0aGUgYWN0aXZhdGlvbiB0aHJlc2hvbGQuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBvcmRlcjogMVxuXG4gICAgICBhY3RpdmF0aW9uVGhyZXNob2xkOlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gQWN0aXZhdGlvbiBUaHJlc2hvbGRcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTdHJlYWsgdGhyZXNob2xkIHRvIGFjdGl2YXRlIHRoZSBwb3dlciBtb2RlLlwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDUwXG4gICAgICAgIG1pbmltdW06IDFcbiAgICAgICAgbWF4aW11bTogMTAwMFxuXG4gICAgICBzdHJlYWtUaW1lb3V0OlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gU3RyZWFrIFRpbWVvdXRcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaW1lb3V0IHRvIHJlc2V0IHRoZSBzdHJlYWsgY291bnRlci4gSW4gc2Vjb25kcy5cIlxuICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICBkZWZhdWx0OiAxMFxuICAgICAgICBtaW5pbXVtOiAxXG4gICAgICAgIG1heGltdW06IDEwMFxuXG4gICAgICBleGNsYW1hdGlvbkV2ZXJ5OlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gRXhjbGFtYXRpb24gRXZlcnlcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTaG93cyBhbiBleGNsYW1hdGlvbiBldmVyeSBzdHJlYWsgY291bnQuXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMTBcbiAgICAgICAgbWluaW11bTogMVxuICAgICAgICBtYXhpbXVtOiAxMDBcblxuICAgICAgZXhjbGFtYXRpb25UZXh0czpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIEV4Y2xhbWF0aW9uIFRleHRzXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRXhjbGFtYXRpb25zIHRvIHNob3cgKHJhbmRvbWl6ZWQpLlwiXG4gICAgICAgIHR5cGU6IFwiYXJyYXlcIlxuICAgICAgICBkZWZhdWx0OiBbXCJTdXBlciFcIiwgXCJSYWRpY2FsIVwiLCBcIkZhbnRhc3RpYyFcIiwgXCJHcmVhdCFcIiwgXCJPTUdcIiwgXCJXaG9haCFcIiwgXCI6T1wiLCBcIk5pY2UhXCIsIFwiU3BsZW5kaWQhXCIsIFwiV2lsZCFcIiwgXCJHcmFuZCFcIiwgXCJJbXByZXNzaXZlIVwiLCBcIlN0dXBlbmRvdXMhXCIsIFwiRXh0cmVtZSFcIiwgXCJBd2Vzb21lIVwiXVxuXG4gICAgICBvcGFjaXR5OlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gT3BhY2l0eVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIk9wYWNpdHkgb2YgdGhlIHN0cmVhayBjb3VudGVyLlwiXG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCJcbiAgICAgICAgZGVmYXVsdDogMC42XG4gICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgbWF4aW11bTogMVxuXG4gIHNjcmVlblNoYWtlOlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgbWluSW50ZW5zaXR5OlxuICAgICAgICB0aXRsZTogXCJTY3JlZW4gU2hha2UgLSBNaW5pbXVtIEludGVuc2l0eVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtaW5pbXVtIChyYW5kb21pemVkKSBpbnRlbnNpdHkgb2YgdGhlIHNoYWtlLlwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgICAgbWluaW11bTogMFxuICAgICAgICBtYXhpbXVtOiAxMDBcblxuICAgICAgbWF4SW50ZW5zaXR5OlxuICAgICAgICB0aXRsZTogXCJTY3JlZW4gU2hha2UgLSBNYXhpbXVtIEludGVuc2l0eVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIChyYW5kb21pemVkKSBpbnRlbnNpdHkgb2YgdGhlIHNoYWtlLlwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDNcbiAgICAgICAgbWluaW11bTogMFxuICAgICAgICBtYXhpbXVtOiAxMDBcblxuICAgICAgZW5hYmxlZDpcbiAgICAgICAgdGl0bGU6IFwiU2NyZWVuIFNoYWtlIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlR1cm4gdGhlIHNoYWtpbmcgb24vb2ZmLlwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcblxuICBwbGF5QXVkaW86XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBlbmFibGVkOlxuICAgICAgICB0aXRsZTogXCJQbGF5IEF1ZGlvIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlBsYXkgYXVkaW8gY2xpcCBvbi9vZmYuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgb3JkZXI6IDFcblxuICAgICAgYXVkaW9jbGlwOlxuICAgICAgICB0aXRsZTogXCJQbGF5IEF1ZGlvIC0gQXVkaW9jbGlwXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2hpY2ggYXVkaW8gY2xpcCBwbGF5ZWQgYXQga2V5c3Ryb2tlLlwiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogJy4uL2F1ZGlvY2xpcHMvZ3VuLndhdidcbiAgICAgICAgZW51bTogW1xuICAgICAgICAgIHt2YWx1ZTogJy4uL2F1ZGlvY2xpcHMvZ3VuLndhdicsIGRlc2NyaXB0aW9uOiAnR3VuJ31cbiAgICAgICAgICB7dmFsdWU6ICcuLi9hdWRpb2NsaXBzL3R5cGV3cml0ZXIud2F2JywgZGVzY3JpcHRpb246ICdUeXBlIFdyaXRlcid9XG4gICAgICAgICAge3ZhbHVlOiAnY3VzdG9tQXVkaW9jbGlwJywgZGVzY3JpcHRpb246ICdDdXN0b20gUGF0aCd9XG4gICAgICAgIF1cbiAgICAgICAgb3JkZXI6IDNcblxuICAgICAgY3VzdG9tQXVkaW9jbGlwOlxuICAgICAgICB0aXRsZTogXCJQbGF5IEF1ZGlvIC0gUGF0aCB0byBBdWRpb2NsaXBcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGF1ZGlvY2xpcCBwbGF5ZWQgYXQga2V5c3Ryb2tlLlwiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogJ3JvY2tzbWFzaC53YXYnXG4gICAgICAgIG9yZGVyOiA0XG5cbiAgICAgIHZvbHVtZTpcbiAgICAgICAgdGl0bGU6IFwiUGxheSBBdWRpbyAtIFZvbHVtZVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlZvbHVtZSBvZiB0aGUgYXVkaW8gY2xpcCBwbGF5ZWQgYXQga2V5c3Ryb2tlLlwiXG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCJcbiAgICAgICAgZGVmYXVsdDogMC40MlxuICAgICAgICBtaW5pbXVtOiAwLjBcbiAgICAgICAgbWF4aW11bTogMS4wXG4gICAgICAgIG9yZGVyOiAyXG5cbiAgcGFydGljbGVzOlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZW5hYmxlZDpcbiAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlR1cm4gdGhlIHBhcnRpY2xlcyBvbi9vZmYuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBvcmRlcjogMVxuXG4gICAgICBjb2xvdXJzOlxuICAgICAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgdHlwZTpcbiAgICAgICAgICAgIHRpdGxlOiBcIkNvbG91cnNcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQ29uZmlndXJlIGNvbG91ciBvcHRpb25zXCJcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiY3Vyc29yXCJcbiAgICAgICAgICAgIGVudW06IFtcbiAgICAgICAgICAgICAge3ZhbHVlOiAnY3Vyc29yJywgZGVzY3JpcHRpb246ICdQYXJ0aWNsZXMgd2lsbCBiZSB0aGUgY29sb3VyIGF0IHRoZSBjdXJzb3IuJ31cbiAgICAgICAgICAgICAge3ZhbHVlOiAncmFuZG9tJywgZGVzY3JpcHRpb246ICdQYXJ0aWNsZXMgd2lsbCBoYXZlIHJhbmRvbSBjb2xvdXJzLid9XG4gICAgICAgICAgICAgIHt2YWx1ZTogJ2ZpeGVkJywgZGVzY3JpcHRpb246ICdQYXJ0aWNsZXMgd2lsbCBoYXZlIGEgZml4ZWQgY29sb3VyLid9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgICBvcmRlcjogMVxuXG4gICAgICAgICAgZml4ZWQ6XG4gICAgICAgICAgICB0aXRsZTogXCJGaXhlZCBjb2xvdXJcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQ29sb3VyIHdoZW4gZml4ZWQgY29sb3VyIGlzIHNlbGVjdGVkXCJcbiAgICAgICAgICAgIHR5cGU6IFwiY29sb3JcIlxuICAgICAgICAgICAgZGVmYXVsdDogXCIjZmZmXCJcblxuICAgICAgdG90YWxDb3VudDpcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIlxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIG1heDpcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIE1heCBUb3RhbFwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSB0b3RhbCBudW1iZXIgb2YgcGFydGljbGVzIG9uIHRoZSBzY3JlZW4uXCJcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgICBkZWZhdWx0OiA1MDBcbiAgICAgICAgICAgIG1pbmltdW06IDBcblxuICAgICAgc3Bhd25Db3VudDpcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIlxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIG1pbjpcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIE1pbmltdW0gU3Bhd25lZFwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWluaW11bSAocmFuZG9taXplZCkgbnVtYmVyIG9mIHBhcnRpY2xlcyBzcGF3bmVkIG9uIGlucHV0LlwiXG4gICAgICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICAgICAgZGVmYXVsdDogNVxuXG4gICAgICAgICAgbWF4OlxuICAgICAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gTWF4aW11bSBTcGF3bmVkXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIChyYW5kb21pemVkKSBudW1iZXIgb2YgcGFydGljbGVzIHNwYXduZWQgb24gaW5wdXQuXCJcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgICBkZWZhdWx0OiAxNVxuXG4gICAgICBzaXplOlxuICAgICAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgbWluOlxuICAgICAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gTWluaW11bSBTaXplXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtaW5pbXVtIChyYW5kb21pemVkKSBzaXplIG9mIHRoZSBwYXJ0aWNsZXMuXCJcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgICBkZWZhdWx0OiAyXG4gICAgICAgICAgICBtaW5pbXVtOiAwXG5cbiAgICAgICAgICBtYXg6XG4gICAgICAgICAgICB0aXRsZTogXCJQYXJ0aWNsZXMgLSBNYXhpbXVtIFNpemVcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gKHJhbmRvbWl6ZWQpIHNpemUgb2YgdGhlIHBhcnRpY2xlcy5cIlxuICAgICAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IDRcbiAgICAgICAgICAgIG1pbmltdW06IDBcblxuICBleGNsdWRlZEZpbGVUeXBlczpcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIGV4Y2x1ZGVkOlxuICAgICAgICB0aXRsZTogXCJQcm9oaWJpdCBhY3RpdmF0ZS1wb3dlci1tb2RlIGZyb20gZW5hYmxpbmcgb24gdGhlc2UgZmlsZSB0eXBlczpcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJVc2UgY29tbWEgc2VwYXJhdGVkLCBsb3dlcmNhc2UgdmFsdWVzIChpLmUuIFxcXCJodG1sLCBjcHAsIGNzc1xcXCIpXCJcbiAgICAgICAgdHlwZTogXCJhcnJheVwiXG4gICAgICAgIGRlZmF1bHQ6IFtcIi5cIl1cbiJdfQ==
