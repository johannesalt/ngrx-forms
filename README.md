# ngrx-forms

[![npm version](https://badge.fury.io/js/ngrx-forms.svg)](https://www.npmjs.com/package/ngrx-forms)
[![Build Status](https://github.com/johannesalt/ngrx-forms/workflows/CI/badge.svg?branch=master)](https://github.com/johannesalt/ngrx-forms/actions?query=workflow:CI)
[![codecov](https://codecov.io/gh/johannesalt/ngrx-forms/branch/master/graph/badge.svg)](https://codecov.io/gh/johannesalt/ngrx-forms)
[![Docs](https://readthedocs.org/projects/ngrx-forms/badge/?version=master)](http://ngrx-forms.readthedocs.io/en/master/?badge=master)
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**ngrx-form-state** brings the strengths of the redux state management model to the world of forms in applications that are using Angular and ngrx. The mechanisms that Angular provides for working with forms are inherently mutable, local, and hard to debug. This library offers a different model for working with forms. Instead of storing the state of form controls inside the components we put them in the ngrx store. We update the state with actions which allows easy debugging just like any other redux application. **ngrx-forms** also provides powerful mechanisms to update, validate and generally manage large complex forms. It contains APIs for synchronous and asynchronous validation, creating dynamic forms, integrating with custom form elements, and much more.

To get to know more you can either read the [official documentation](http://ngrx-forms.readthedocs.io/en/master) or visit the [example application](https://johannesalt.github.io/ngrx-forms/).

#### Installation

```Shell
npm install ngrx-form-state --save
```

This library has a peer dependency on `@angular/core`, `@angular/common`, `@angular/forms`, and `@ngrx/store`, so make sure appropriate versions of those packages are installed.

#### Bug reports

To report a bug please provide a reproduction of the issue in a code sandbox. You can fork [this example](https://codesandbox.io/s/92r7310k4).

#### Contributing

Please see the [documentation](http://ngrx-forms.readthedocs.io/en/master/contributing/).

#### License

Everything in this repository is [licensed under the MIT License](LICENSE) unless otherwise specified.
