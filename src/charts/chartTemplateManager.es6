/**
 * Created by amin on July 31, 2016.
 */
define(['jquery', 'charts/chartWindow', 'common/rivetsExtra'], function($, chartWindow, rv) {
  require(['text!charts/ChartTemplateManager.html']);

  class ChartTemplateManager {
    constructor(root, dialog_id) {
      const state = this.init_state(root, dialog_id);
      require(['text!charts/ChartTemplateManager.html'], html => {
        root.append(html);
        this.view = rv.bind(root[0], state);
      });
    }

    init_state(root, dialog_id) {
      const chart = $('#' + dialog_id + '_chart').highcharts();
      const state = {
        route: { value: 'menu' },
        menu: {
          save_changes_disabled: true
        },
        templates: {
          array: [],
          save_as_value: '',
          rename_value: '',
          current: null
        }
      };
      const {route, templates, menu} = state;

      route.update = value => {
        route.value = value;
      };

      menu.save_as = () => {
        const options = chartWindow.get_chart_options(dialog_id) || {};
        templates.save_as_value = [`${options.timePeriod} ${options.type}`]
                      .concat(options.indicators.map(ind => ind.name))
                      .concat(options.overlays.map(overlay => overlay.displaySymbol))
                      .join(' + ');
        route.update('save-as');
      }

      templates.save_as = function() {
        const name = templates.save_as_value;
        const options = chartWindow.get_chart_options(dialog_id);
        if(options) {
          options.instrumentCode = '';
          options.instrumentName = '';
          options.name = name;
          if(templates.array.map(t => t.name).includes(name)) {
            $.growl.error({message: 'Template name already exists'.i18n() });
            return;
          }
          templates.array.push(options);
          templates.current = options;
          local_storage.set('templates', templates.array);
          route.update('menu');
        }
      }

      menu.save_changes = () => {
        console.warn('save changes');
      }

      return state;
    }

    unbind() {
      this.view && this.view.unbind();
      this.view = null;
    }
  }

  return {
    init: (root, dialog_id) => new ChartTemplateManager(root, dialog_id)
  }
});
