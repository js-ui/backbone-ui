(function(){
  window.Backbone.UI.RadioGroup = Backbone.View.extend({

    options : {
      // A callback to invoke with the selected item whenever the selection changes
      onChange : Backbone.UI.noop
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasAlternativeProperty]);
      _(this).bindAll('render');
      
      $(this.el).addClass('radio_group');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
    },

    // public accessors
    selectedItem : null,

    render : function() {

      $(this.el).empty();

      this._observeModel(this.render);
      this._observeCollection(this.render);

      this.selectedItem = this._determineSelectedItem() || this.selectedItem;

      this._ul = $.el.ul();
      var selectedValue = this._valueForItem(this.selectedItem);
      _(this._collectionArray()).each(function(item) {

        var selected = selectedValue === this._valueForItem(item);

        var label = this.resolveContent(item, this.options.altLabelContent);
        if(label.nodeType === 1) {
          $('a',label).click(function(e){
            e.stopPropagation(); 
          });
        }
        
        var li = $.el.li(
          $.el.a({className : 'choice' + (selected ? ' selected' : '')},
            $.el.div({className : 'mark' + (selected ? ' selected' : '')}, 
              selected ? '\u25cf' : '\u00a0')));      
        
        // insert label into li then add to ul
        $.el.div({className : 'label'}, label).appendTo(li);
        this._ul.appendChild(li);

        $(li).bind('click', _.bind(this._onChange, this, item));
        
      }, this);
      this.el.appendChild(this._ul);
      this._updateClassNames();
      return this;
    },

    _onChange : function(item) {
      //check if item selected actually changed
      var changed = this.selectedItem !== item;
      this._setSelectedItem(item);
      this.render();

      if(_(this.options.onChange).isFunction() && changed) this.options.onChange(item);
      return false;
    },
    
    _updateClassNames : function() {
      var children = this._ul.childNodes;
      if(children.length > 0) {
        _(children).each(function(child, index) {
          $(child).removeClass('first');
          $(child).removeClass('last');
          $(child).addClass(index % 2 === 0 ? 'even' : 'odd');
        });
        $(children[0]).addClass('first');
        $(children[children.length - 1]).addClass('last');
      }
    }
  });
}());
