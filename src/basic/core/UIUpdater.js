export class UIUpdater {
  constructor(domManager) {
    this.dom = domManager;
  }

  // 순수한 UI 업데이트 메서드들
  updateElementText(element, text) {
    if (element) {
      this.dom.setTextContent(element, text);
    }
  }

  updateElementHTML(element, html) {
    if (element) {
      this.dom.setInnerHTML(element, html);
    }
  }

  updateElementAttribute(element, attribute, value) {
    if (element) {
      this.dom.setAttribute(element, attribute, value);
    }
  }

  updateElementClass(element, className, shouldAdd = true) {
    if (element) {
      if (shouldAdd) {
        this.dom.addClass(element, className);
      } else {
        this.dom.removeClass(element, className);
      }
    }
  }

  updateElementStyle(element, property, value) {
    if (element) {
      element.style[property] = value;
    }
  }

  updateElementValue(element, value) {
    if (element) {
      element.value = value;
    }
  }

  updateElementVisibility(element, isVisible) {
    if (element) {
      this.updateElementStyle(element, 'display', isVisible ? '' : 'none');
    }
  }

  updateElementDisabled(element, isDisabled) {
    if (element) {
      element.disabled = isDisabled;
    }
  }

  updateElementSelected(element, isSelected) {
    if (element) {
      element.selected = isSelected;
    }
  }

  updateElementChecked(element, isChecked) {
    if (element) {
      element.checked = isChecked;
    }
  }

  updateElementSrc(element, src) {
    if (element) {
      this.dom.setAttribute(element, 'src', src);
    }
  }

  updateElementHref(element, href) {
    if (element) {
      this.dom.setAttribute(element, 'href', href);
    }
  }

  updateElementPlaceholder(element, placeholder) {
    if (element) {
      this.dom.setAttribute(element, 'placeholder', placeholder);
    }
  }

  updateElementTitle(element, title) {
    if (element) {
      this.dom.setAttribute(element, 'title', title);
    }
  }

  updateElementAlt(element, alt) {
    if (element) {
      this.dom.setAttribute(element, 'alt', alt);
    }
  }

  updateElementData(element, key, value) {
    if (element) {
      this.dom.setAttribute(element, `data-${key}`, value);
    }
  }

  updateElementId(element, id) {
    if (element) {
      this.dom.setAttribute(element, 'id', id);
    }
  }

  updateElementName(element, name) {
    if (element) {
      this.dom.setAttribute(element, 'name', name);
    }
  }

  updateElementType(element, type) {
    if (element) {
      this.dom.setAttribute(element, 'type', type);
    }
  }

  updateElementMax(element, max) {
    if (element) {
      this.dom.setAttribute(element, 'max', max);
    }
  }

  updateElementMin(element, min) {
    if (element) {
      this.dom.setAttribute(element, 'min', min);
    }
  }

  updateElementStep(element, step) {
    if (element) {
      this.dom.setAttribute(element, 'step', step);
    }
  }

  updateElementRequired(element, isRequired) {
    if (element) {
      if (isRequired) {
        this.dom.setAttribute(element, 'required', '');
      } else {
        element.removeAttribute('required');
      }
    }
  }

  updateElementReadonly(element, isReadonly) {
    if (element) {
      if (isReadonly) {
        this.dom.setAttribute(element, 'readonly', '');
      } else {
        element.removeAttribute('readonly');
      }
    }
  }

  updateElementAutocomplete(element, autocomplete) {
    if (element) {
      this.dom.setAttribute(element, 'autocomplete', autocomplete);
    }
  }

  updateElementPattern(element, pattern) {
    if (element) {
      this.dom.setAttribute(element, 'pattern', pattern);
    }
  }

  updateElementMaxlength(element, maxlength) {
    if (element) {
      this.dom.setAttribute(element, 'maxlength', maxlength);
    }
  }

  updateElementMinlength(element, minlength) {
    if (element) {
      this.dom.setAttribute(element, 'minlength', minlength);
    }
  }

  updateElementSize(element, size) {
    if (element) {
      this.dom.setAttribute(element, 'size', size);
    }
  }

  updateElementMultiple(element, isMultiple) {
    if (element) {
      if (isMultiple) {
        this.dom.setAttribute(element, 'multiple', '');
      } else {
        element.removeAttribute('multiple');
      }
    }
  }

  updateElementAccept(element, accept) {
    if (element) {
      this.dom.setAttribute(element, 'accept', accept);
    }
  }

  updateElementForm(element, form) {
    if (element) {
      this.dom.setAttribute(element, 'form', form);
    }
  }

  updateElementFormaction(element, formaction) {
    if (element) {
      this.dom.setAttribute(element, 'formaction', formaction);
    }
  }

  updateElementFormenctype(element, formenctype) {
    if (element) {
      this.dom.setAttribute(element, 'formenctype', formenctype);
    }
  }

  updateElementFormmethod(element, formmethod) {
    if (element) {
      this.dom.setAttribute(element, 'formmethod', formmethod);
    }
  }

  updateElementFormnovalidate(element, isFormnovalidate) {
    if (element) {
      if (isFormnovalidate) {
        this.dom.setAttribute(element, 'formnovalidate', '');
      } else {
        element.removeAttribute('formnovalidate');
      }
    }
  }

  updateElementFormtarget(element, formtarget) {
    if (element) {
      this.dom.setAttribute(element, 'formtarget', formtarget);
    }
  }

  updateElementHeight(element, height) {
    if (element) {
      this.dom.setAttribute(element, 'height', height);
    }
  }

  updateElementWidth(element, width) {
    if (element) {
      this.dom.setAttribute(element, 'width', width);
    }
  }

  updateElementCols(element, cols) {
    if (element) {
      this.dom.setAttribute(element, 'cols', cols);
    }
  }

  updateElementRows(element, rows) {
    if (element) {
      this.dom.setAttribute(element, 'rows', rows);
    }
  }

  updateElementWrap(element, wrap) {
    if (element) {
      this.dom.setAttribute(element, 'wrap', wrap);
    }
  }

  updateElementSpellcheck(element, isSpellcheck) {
    if (element) {
      this.dom.setAttribute(element, 'spellcheck', isSpellcheck);
    }
  }

  updateElementTabindex(element, tabindex) {
    if (element) {
      this.dom.setAttribute(element, 'tabindex', tabindex);
    }
  }

  updateElementAccesskey(element, accesskey) {
    if (element) {
      this.dom.setAttribute(element, 'accesskey', accesskey);
    }
  }

  updateElementContenteditable(element, isContenteditable) {
    if (element) {
      this.dom.setAttribute(element, 'contenteditable', isContenteditable);
    }
  }

  updateElementDir(element, dir) {
    if (element) {
      this.dom.setAttribute(element, 'dir', dir);
    }
  }

  updateElementLang(element, lang) {
    if (element) {
      this.dom.setAttribute(element, 'lang', lang);
    }
  }

  updateElementTranslate(element, isTranslate) {
    if (element) {
      this.dom.setAttribute(element, 'translate', isTranslate);
    }
  }

  updateElementDraggable(element, isDraggable) {
    if (element) {
      this.dom.setAttribute(element, 'draggable', isDraggable);
    }
  }

  updateElementDropzone(element, dropzone) {
    if (element) {
      this.dom.setAttribute(element, 'dropzone', dropzone);
    }
  }

  updateElementHidden(element, isHidden) {
    if (element) {
      if (isHidden) {
        this.dom.setAttribute(element, 'hidden', '');
      } else {
        element.removeAttribute('hidden');
      }
    }
  }

  updateElementContextmenu(element, contextmenu) {
    if (element) {
      this.dom.setAttribute(element, 'contextmenu', contextmenu);
    }
  }

  updateElementInert(element, isInert) {
    if (element) {
      if (isInert) {
        this.dom.setAttribute(element, 'inert', '');
      } else {
        element.removeAttribute('inert');
      }
    }
  }

  updateElementPopover(element, popover) {
    if (element) {
      this.dom.setAttribute(element, 'popover', popover);
    }
  }

  updateElementSlot(element, slot) {
    if (element) {
      this.dom.setAttribute(element, 'slot', slot);
    }
  }
}
