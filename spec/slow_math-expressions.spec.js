/*
 * test code for math expressions
 *
 * Copyright 2014-2015 by Jim Fowler <kisonecat@gmail.com>
 *
 * Some portions adopted from Stack (http://stack.bham.ac.uk/)
 * which is licensed under GPL v3+
 * and (C) 2012 University of Birmingham
 *
 * This file is part of a math-expressions library
 *
 * Some open source application is free software: you can redistribute
 * it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or at your option any later version.
 *
 * Some open source application is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 */

import Expression from "../lib/math-expressions";

import _ from "underscore";

describe("expression", function () {
  var equivalences = [
    ["3+2", "5"],
    ["-2 sin(t^2)/t", "-2 t sin(t^2)/t^2"],
    ["-2t sin(t^2)/t^2 + 3t^2 sin(t^3)/t^3", "-2 sin(t^2)/t + 3 sin(t^3)/t"],
    ["sin(t^2)*t/t", "sin(t^2)"],
    ["(1/3)g^3", "(g^3)/(3)"],
    ["x*log(3)", "log(3^x)"],
    ["e^(e^x+x/x)", "e^(e^x+1)"],
    ["exp(exp(exp(x)))", "exp(exp(exp(x)))"],
    [
      "(x^5 + 5*x^4 + 20*x^3 + 60*x^2 + 120*x + 120)/120",
      "1/120*x^5 + 1/24*x^4 + 1/6*x^3 + 1/2*x^2 + x + 1",
    ],
    [
      "(x^9 - 72*x^7 + 3024*x^5 - 60480*x^3 + 362880*x)/362880",
      "1/362880*x^9 - 1/5040*x^7 + 1/120*x^5 - 1/6*x^3 + x",
    ],
    ["e^(e^x)", "e^(e^x)"],
    [
      "1 + x + x^2/2+ x^3/3! + x^4/4!+ x^5/5! + x^6/6!+x^7/7!",
      "1 + x + x^2/2+ x^3/6 + x^4/24 + x^5/120 + x^6/720 +x^7/5040",
    ],
    ["1/sqrt(4)", "1/2"],
    ["4^(-1/2)", "1/2"],
    ["0.5", "1/2"], // 'Mix of floats and rational numbers'
    ["x^(1/2)", "sqrt(x)"],
    // ["abs(x)", "sqrt(x^2)"],
    ["1/sqrt(x)", "sqrt(1/x)"],
    ["x-1", "(x^2-1)/(x+1)"],
    ["a^b * a^c", "a^(b+c)"],
    ["2+2*sqrt(3+x)", "2+sqrt(12+4*x)"],
    ["1/n-1/(n+1)", "1/(n*(n+1))"],
    ["0.5*x^2+3*x-1", "x^2/2+3*x-1"],
    ["cos(x)", "cos(-x)"],
    ["cos(x)^2+sin(x)^2", "1"],
    ["2*cos(x)^2-1", "cos(2*x)"],
    ["2*cos(2*x)+x+1", "-sin(x)^2+3*cos(x)^2+x"],
    [
      "(2*sec(2*t)^2-2)/2",
      "-(sin(4*t)^2-2*sin(4*t)+cos(4*t)^2-1)*(sin(4*t)^2+2*sin(4*t)+cos(4*t)^2-1)/(sin(4*t)^2+cos(4*t)^2+2*cos(4*t)+1)^2",
    ],
    [
      "-4*sec(4*z)^2*sin(6*z)-6*tan(4*z)*cos(6*z)",
      "-4*sec(4*z)^2*sin(6*z)-6*tan(4*z)*cos(6*z)",
    ],
    ["log(a^2*b)", "2*log(a)+log(b)"],
    ["sqrt(12)", "2*sqrt(3)"],
    ["sqrt(11+6*sqrt(2))", "3+sqrt(2)"],
    // ['(19601-13860*sqrt(2))^(7/4)', '(5*sqrt(2)-7)^7'],
    ["sqrt(2*log(26)+4-2*log(2))", "sqrt(2*log(13)+4)"],
    ["1+2*x", "x*2+1"],
    ["(x+y)+z", "z+x+y"],
    ["(x+5)*x", "x*(5+x)"],
    ["x*x", "x^2"],
    ["(1-x)^2", "(x-1)^2"],
    ["x*(x+5)", "5*x+x^2"],
    ["1+x+x", "2*x+1"],
    ["2^2", "4"],
    ["a^2/b^3", "a^2*b^(-3)"],
    ["x^(1/2)", "sqrt(x)"],
    ["x-1", "(x^2-1)/(x+1)"],
    ["x+x", "2*x"],
    ["x+x^2", "x^2+x"],
    ["(x-1)^2", "x^2-2*x+1"],
    ["(x-1)^(-2)", "1/(x^2-2*x+1)"],
    ["1/n-1/(n+1)", "1/(n*(n+1))"],
    ["cos(x)", "cos(-x)"],
    ["cos(x)^2+sin(x)^2", "1"],
    ["cos^2 x+sin^2 x", "1"],
    ["tan^2 x", "(tan x)(tan(x))"],
    ["2*cos(x)^2-1", "cos(2*x)"],
    ["(1/2)/(3/4)", "2/3"],
    ["1/n", "1/n"],
    ["a+1/2", "(2*a+1)/2"],
    ["1/n +2/(n+1)", "(3*n+1)/(n*(n+1))"],
    ["2*(1/n)", "2/n"],
    ["2/n", "2/n"],
    ["(x-1)/(x^2-1)", "1/(x+1)"],
    ["(x-2)/4/(2/x^2)", "(x-2)*x^2/8"],
    ["1/(1-1/x)", "x/(x-1)"],
    ["(sqrt(108)+10)^(1/3)-(sqrt(108)-10)^(1/3)", "2"],
    ["(sqrt(2+sqrt(2))+sqrt(2-sqrt(2)))/(2*sqrt(2))", "sqrt(sqrt(2)+2)/2"],
    ["x^2+1", "x^2+1"],
    ["(-1)^n*cos(x)^n", "(-cos(x))^n"],
    ["log(abs((x^2-9)))", "log(abs(x-3))+log(abs(x+3))"],
    ["log(exp(x))", "x"],
    ["exp(log(x))", "x"],
    ["(x-1)^2", "x^2-2*x+1"],
    ["(x-1)*(x^2+x+1)", "x^3-1"],
    ["(x-1)^(-2)", "1/(x^2-2*x+1)"],
    ["2/4", "1/2"],
    ["2^3", "8"],
    ["3^2", "9"],
    ["sqrt(3)", "3^(1/2)"],
    ["2*sqrt(2)", "sqrt(8)"],
    ["2*2^(1/2)", "sqrt(8)"],
    ["4^(1/2)", "2"],
    ["sqrt(3)/3", "(1/3)^(1/2)"],
    ["sqrt(2)/4", "1/sqrt(8)"],
    ["1/3^(1/2)", "(1/3)^(1/2)"],
    ["1/sqrt(2)", "2^(1/2)/2"],
    ["a^2/b^3", "a^2*b^(-3)"],
    ["-1+2", "2-1"],
    ["-1*2+3*4", "3*4-1*2"],
    ["-1*2+3*4", "3*4-1*2"],
    ["(-1*2)+3*4", "10"],
    ["x*(-y)", "-x*y"],
    ["x*(-y)", "-(x*y)"],
    ["(-x)*(-x)", "x*x"],
    ["(-x)*(-x)", "x^2"],
    ["1/2", "3/6"],
    ["1/(1+2*x)", "1/(2*x+1)"],
    ["2/(4+2*x)", "1/(x+2)"],
    ["(a*b)/c", "a*(b/c)"],
    ["(-x)/y", "-(x/y)"],
    ["x/(-y)", "-(x/y)"],
    ["-1/(1-x)", "1/(x-1)"],
    ["1/2*1/x", "1/(2*x)"],
    ["2", "2"],
    ["1/3", "1/3"],
    ["3*x^2", "3*x^2"],
    ["4*x^2", "4*x^2"],
    ["2*(x-1)", "2*x-2"],
    ["2*x-2", "2*x-2"],
    ["2*(x+1)", "2*x+2"],
    ["2*(x+0.5)", "2*x+1"],
    ["t*(2*x+1)", "t*(2*x+1)"],
    ["t*x+t", "t*(x+1)"],
    ["2*x*(x-3)", "2*x^2-6*x"],
    ["2*(x^2-3*x)", "2*x*(x-3)"],
    ["x*(2*x-6)", "2*x*(x-3)"],
    ["(x+2)*(x+3)", "(x+2)*(x+3)"],
    ["(x+2)*(2*x+6)", "2*(x+2)*(x+3)"],
    ["(z*x+z)*(2*x+6)", "2*z*(x+1)*(x+3)"],
    ["(x+t)*(x-t)", "x^2-t^2"],
    ["t^2-1", "(t-1)*(t+1)"],
    ["(2-x)*(3-x)", "(x-2)*(x-3)"],
    ["(1-x)^2", "(x-1)^2"],
    ["-(1-x)^2", "-(x-1)^2"],
    ["4*(1-x/2)^2", "(x-2)^2"],
    ["(x-1)*(x^2+x+1)", "x^3-1"],
    ["x^3-x+1", "x^3-x+1"],
    ["7*x^3-7*x+7", "7*(x^3-x+1)"],
    ["(1-x)*(2-x)*(3-x)", "-x^3+6*x^2-11*x+6"],
    ["(2-x)*(2-x)*(3-x)", "-x^3+7*x^2-16*x+12"],
    ["(2-x)^2*(3-x)", "-x^3+7*x^2-16*x+12"],
    ["(x^2-4*x+4)*(3-x)", "-x^3+7*x^2-16*x+12"],
    ["(x^2-3*x+2)*(3-x)", "-x^3+6*x^2-11*x+6"],
    ["3*y^3-6*y^2-24*y", "3*(y-4)*y*(y+2)"],
    ["3*(y^3-2*y^2-8*y)", "3*(y-4)*y*(y+2)"],
    ["3*y*(y^2-2*y-8)", "3*(y-4)*y*(y+2)"],
    ["3*(y^2-4*y)*(y+2)", "3*(y-4)*y*(y+2)"],
    ["(y-4)*y*(3*y+6)", "3*(y-4)*y*(y+2)"],
    ["24*(x-1/4)", "24*x-6"],
    ["(x-sqrt(2))*(x+sqrt(2))", "x^2-2"],
    ["1/(n+1)-1/n", "1/(n+1)-1/n"],
    ["1/(n+1)+1/(1-n)", "1/(n+1)-1/(n-1)"],
    ["1/(2*(n-1))-1/(2*(n+1))", "1/((n-1)*(n+1))"],
    ["1/(x-1)-(x+1)/(x^2+1)", "2/((x-1)*(x^2+1))"],
    ["1/(2*x-2)-(x+1)/(2*(x^2+1))", "1/((x-1)*(x^2+1))"],
    ["3/(x+1) + 3/(x+2)", "3*(2*x+3)/((x+1)*(x+2))"],
    ["3*(1/(x+1) + 1/(x+2))", "3*(2*x+3)/((x+1)*(x+2))"],
    ["3*x*(1/(x+1) + 2/(x+2))", "-12/(x+2)-3/(x+1)+9"],
    ["2*x+1/(x+1)+1/(x-1)", "2*x^3/(x^2-1)"],
    ["(2*x+1)/(x^2+1)-2/(x-1)", "(2*x+1)/(x^2+1)-2/(x-1)"],
    ["-1/((s+1)^2) - 2/(s+2) + 2/(s+1)", "s/((s+1)^2*(s+2))"],
    [
      "(-5/(x+3))+(16/(x+3)^2)-(2/(x+2))+4",
      "(-5/(x+3))+(16/(x+3)^2)-(2/(x+2))+4",
    ],
    ["-5/(16*x)+53/(16*(x-4))+43/(4*(x-4)^2)", "(3*x^2-5)/((x-4)^2*x)"],
    ["-1/(16*(x+5))+19/(4*(x+5)^2)+1/(16*(x+1))", "(5*x+6)/((x+1)*(x+5)^2)"],
    ["-5/(16*x)+1/(2*(x-1))-1/(8*(x-1)^2)", "(3*x^2-5)/((4*x-4)^2*x)"],
    ["(3*x^2-5)/((x-4)^2*x)", "(3*x^2-5)/((x-4)^2*x)"],
    ["125/(34*(5*x-2))+5/(51*(x+3))-5/(6*x)", "5/(x*(x+3)*(5*x-2))"],
    ["10/(x+3) - 2/(x+2) + x -2", "(x^3 + 3*x^2 + 4*x +2)/((x+2)*(x+3))"],
    ["(cos(t)-sqrt(2))^2", "cos(t)^2-2*sqrt(2)*cos(t)+2"],
    ["(n+1)*n!", "(n+1)!"],
    ["n/n!", "1/(n-1)!"],
    ["(n!)^2", "n! * n!"],
    ["abs((-x)^(1/3))", "(abs(-x))^(1/3)"],
    // ['abs(x)' , '(x^4)^(1/4)'],
    // ['abs(x)' , 'sqrt(sqrt(x^4))'],
    ["arcsin(x)", "arcsin(x)"],
    ["arccos(x)", "arccos(x)"],
    ["arctan(x)", "arctan(x)"],
    ["arcsec(x)", "arcsec(x)"],
    ["arccsc(x)", "arccsc(x)"],
    ["arccot(x)", "arccot(x)"],
    ["arcsinh(x)", "arcsinh(x)"],
    ["arccosh(x)", "arccosh(x)"],
    ["arctanh(x)", "arctanh(x)"],
    ["arcsech(x)", "arcsech(x)"],
    ["arccsch(x)", "arccsch(x)"],
    ["arccoth(x)", "arccoth(x)"],
    ["cos^(-1)(x)", "acos(x)"],
    ["cos^(-1)(x)", "arccos(x)"],
    ["acos(x)", "arccos(x)"],
    ["cot^(-1)(x)", "acot(x)"],
    ["cot^(-1)(x)", "arccot(x)"],
    ["acot(x)", "arccot(x)"],
    ["csc^(-1)(x)", "acsc(x)"],
    ["csc^(-1)(x)", "arccsc(x)"],
    ["acsc(x)", "arccsc(x)"],
    ["sec^(-1)(x)", "asec(x)"],
    ["sec^(-1)(x)", "arcsec(x)"],
    ["asec(x)", "arcsec(x)"],
    ["sin^(-1)(x)", "asin(x)"],
    ["sin^(-1)(x)", "arcsin(x)"],
    ["asin(x)", "arcsin(x)"],
    ["tan^(-1)(x)", "atan(x)"],
    ["tan^(-1)(x)", "arctan(x)"],
    ["atan(x)", "arctan(x)"],
    ["cosh^(-1)(x)", "acosh(x)"],
    ["cosh^(-1)(x)", "arccosh(x)"],
    ["acosh(x)", "arccosh(x)"],
    ["coth^(-1)(x)", "acoth(x)"],
    ["coth^(-1)(x)", "arccoth(x)"],
    ["acoth(x)", "arccoth(x)"],
    ["csch^(-1)(x)", "acsch(x)"],
    ["csch^(-1)(x)", "arccsch(x)"],
    ["acsch(x)", "arccsch(x)"],
    ["sech^(-1)(x)", "asech(x)"],
    ["sech^(-1)(x)", "arcsech(x)"],
    ["asech(x)", "arcsech(x)"],
    ["sinh^(-1)(x)", "asinh(x)"],
    ["sinh^(-1)(x)", "arcsinh(x)"],
    ["asinh(x)", "arcsinh(x)"],
    ["tanh^(-1)(x)", "atanh(x)"],
    ["tanh^(-1)(x)", "arctanh(x)"],
    ["atanh(x)", "arctanh(x)"],
    ["sin^2(x)", "sin(x)^2"],
    ["sin^2 x ", "sin(x)^2"],
    ["sin^n(x)", "sin(x)^n"],
    ["sin^n x ", "sin(x)^n"],
    ["sinh^2(x)", "sinh(x)^2"],
    ["sinh^2 x ", "sinh(x)^2"],
    ["sinh^n(x)", "sinh(x)^n"],
    ["sinh^n x ", "sinh(x)^n"],
    ["cos^2(x)", "cos(x)^2"],
    ["cos^2 x ", "cos(x)^2"],
    ["cos^n(x)", "cos(x)^n"],
    ["cos^n x ", "cos(x)^n"],
    ["cosh^2(x)", "cosh(x)^2"],
    ["cosh^2 x ", "cosh(x)^2"],
    ["cosh^n(x)", "cosh(x)^n"],
    ["cosh^n x ", "cosh(x)^n"],
    ["tan^2(x)", "tan(x)^2"],
    ["tan^2 x ", "tan(x)^2"],
    ["tan^n(x)", "tan(x)^n"],
    ["tan^n x ", "tan(x)^n"],
    ["tanh^2(x)", "tanh(x)^2"],
    ["tanh^2 x ", "tanh(x)^2"],
    ["tanh^n(x)", "tanh(x)^n"],
    ["tanh^n x ", "tanh(x)^n"],
    ["sec^2(x)", "sec(x)^2"],
    ["sec^2 x ", "sec(x)^2"],
    ["sec^n(x)", "sec(x)^n"],
    ["sec^n x ", "sec(x)^n"],
    ["sech^2(x)", "sech(x)^2"],
    ["sech^2 x ", "sech(x)^2"],
    ["sech^n(x)", "sech(x)^n"],
    ["sech^n x ", "sech(x)^n"],
    ["csc^2(x)", "csc(x)^2"],
    ["csc^2 x ", "csc(x)^2"],
    ["csc^n(x)", "csc(x)^n"],
    ["csc^n x ", "csc(x)^n"],
    ["csch^2(x)", "csch(x)^2"],
    ["csch^2 x ", "csch(x)^2"],
    ["csch^n(x)", "csch(x)^n"],
    ["csch^n x ", "csch(x)^n"],
    ["cot^2(x)", "cot(x)^2"],
    ["cot^2 x ", "cot(x)^2"],
    ["cot^n(x)", "cot(x)^n"],
    ["cot^n x ", "cot(x)^n"],
    ["coth^2(x)", "coth(x)^2"],
    ["coth^2 x ", "coth(x)^2"],
    ["coth^n(x)", "coth(x)^n"],
    ["coth^n x ", "coth(x)^n"],
    ["log(x^2*y/z)", "log(x^2*y) - log(z)"],
    ["log(x^2*y/z)", "log(x^2) + log(y) - log(z)"],
    ["log(x^2*y/z)", "2*log(x) + log(y) - log(z)"],
    ["log(x^2*y/exp(1))", "2*log(x) + log(y) - 1"],
    ["log(sqrt(x^2 + 9) + x) - log(3)", "(asinh(x/3))"],
    ["sin(x + y)", "sin(x)*cos(y) + cos(x)*sin(y)"],
    ["cos(x + y)", "cos(x)*cos(y) - sin(x)*sin(y)"],
    ["log(x)/8", "0.125*log(x)"],
    ["log(x)/8", "(1/8)*log(x)"],
    //"x/2-sin(2x)/4-(cos(x))^3/3", "x/2+sin(2x)/4-(cos(x))^3/3"],
    ["(1/8)*log(x)", "0.125*log(x)"],
    ["1", "1"],
    ["sqrt(10000 - x)", "sqrt(10000 - x)"],
    ["x*log(y)", "log(y^x)"],
    ["exp(x^y)", "exp(x^y)"],
    ["(exp(x))^y", "exp(x*y)"],
    ["0*x", "0*y"],
    ["oo", "+oo"],
    ["-2 cos(t)^2 sin(t)", "-cos t sin(2 t)"],
    ["e^(-10x)+1", "e^(-10x)+sin^2(x)+cos^2(x)"],
    ["e^(10x)+1", "e^(10x)+sin^2(x)+cos^2(x)"],
    ["(2x,y^2)", "(x+x, y*y)"],
    ["(2x,y^2]", "(x+x,y*y]"],
    ["[2x,y^2)", "[x+x,y*y)"],
    ["[2x,y^2]", "[x+x,y*y]"],
    ["arcsin(1/2)", "pi/6"],
    ["sqrt(e)", "e^(1/2)"],
    ["sin(pi)", "0"],
    ["cos(pi)", "-1"],
    ["sin(pi/2)", "1"],
    ["cos(pi/2)", "0"],
    ["atan2(sqrt(3),1)", "pi/3"],
    ["atan2(-sqrt(3),-1)", "-2*pi/3"],
    ["5x + 2y = 3", "6-4y = 10x"],
    ["5x + 2y = 3", "-(6-4y) = -10x"],
    ["5q-9z < 2u+9z", "27z -5q > -4u + 5q-9z"],
    ["5q-9z > 2u+9z", "27z -5q < -4u + 5q-9z"],
    ["5q-9z <= 2u+9z", "27z -5q >= -4u + 5q-9z"],
    ["5q-9z >= 2u+9z", "27z -5q <= -4u + 5q-9z"],
    ["(k+1)y_t", "k*y_t + y_t"],
    ["2+", "2+"],
    ["5C^(4+)-2C^(4+)", "3C^(4+)"],
    ["5C_(4+)-2C_(4+)", "3C_(4+)"],
    ["re(3-5i)", "3"],
    ["im(3-5i)", "-5"],
    ["(f(a)-f(b))(x)", "(f(b)-f(a))(-x)"],
    ["(f(a)-g(b))(x)", "(g(b)-f(a))(-x)"],
    ["(f^2(a)-f^3(b))(x)", "(f^3(b)-f^2(a))(-x)"],
    ["(f^2(a)-g^3(b))(x)", "(g^3(b)-f^2(a))(-x)"],
    ["(f_5^2(a)-g^3(b))(x)", "(g^3(b)-f_5^2(a))(-x)"],
    ["(f_2(a)-f_3(b))(x)", "(f_3(b)-f_2(a))(-x)"],
    ["(f_2(a)-g_3(b))(x)", "(g_3(b)-f_2(a))(-x)"],
    ["(f(a)-g(f))(x)", "(g(f)-f(a))(-x)"],
    ["(f^2(g)-g^3(b))(x)", "(g^3(b)-f^2(g))(-x)"],
    ["(f_2(a)-g_3(f_2))(x)", "(g_3(f_2)-f_2(a))(-x)"],
    ["(f_5^2(a)-g^3(f_5))(x)", "(g^3(f_5)-f_5^2(a))(-x)"],
    ["(f_5^2(a)-g^3(f_5))(x)+sin^2x+cos^2x", "(g^3(f_5)-f_5^2(a))(-x)+1"],
    [
      "(f(a)f(b)-f(c)f(d)f(g))(g(x)g(y)-g(f))",
      "(f(c)f(d)f(g)-f(a)f(b))(g(f)-g(y)g(x))",
    ],
    ["arg(1+4i)", "arg(5+20i)"],
    ["arg(x)", "arg(5x)"],
    ["log_10(100000)", "5"],
    ["log_2(8)", "3"],
    ["log_a(b)", "log(b)/log(a)"],
    ["nCr(8,3)", "56"],
    ["nPr(8,3)", "336"],
    ["binom(8,3)", "56"],
    ["binom(n,m)", "nCr(n,m)"],
    ["floor(17.8)", "17"],
    ["floor(-17.3)", "-18"],
    ["ceil(17.3)", "18"],
    ["ceil(-17.8)", "-17"],
    ["round(17.3)", "17"],
    ["round(-17.3)", "-17"],
    ["round(17.8)", "18"],
    ["round(-17.8)", "-18"],
    ["f'(x)", "f(x)'"],
    ["f''(x)", "f(x)''"],
    ["f'''(x)", "f(x)'''"],
    ["+2", "2"],
    ["++2", "2"],
    ["+x", "x"],
    ["++x", "x"],
    ["x++y", "x+y"],
    ["x(+y)", "xy"],
    ["x(++y)", "xy"],
    ["x+-y", "x-y"],
    ["x++-y", "x-y"],
    ["x++--y", "x+y"],
    ["x--y", "x+y"],
    ["∠ABC", "∠CBA"],
    ["∠ABC + ∠DEF", "∠CBA + ∠FED"],
    ["linesegment(A,B)", "linesegment(B,A)"],
    [
      "linesegment(A,B) + linesegment(C,D)",
      "linesegment(B,A) + linesegment(D,C)",
    ],
    ["$5", "$3+$2"],
    ["$5", "$9-$4"],
    ["$xy+a$b", "$(xy+ab)"],
    ["50%", "1/2"],
    ["50% + 1", "1.5"],
    ["x%", "x/100"],
    ["180 deg", "pi"],
    ["∫_(a+a)^(5b-b)xx dx", "∫_(2a)^(4b)x^2dx"],
    ["∫_(a+a)^(5b-b)dx xx", "∫_(2a)^(4b)x^2dx"],
    ["∫ f(x)f(x)dx", "∫ f(x)^2dx"],
    ["x ∈ A", "A ∋ x"],
    ["x ∉ A", "A ∌ x"],
    ["A ⊂ B", "B ⊃ A"],
    ["A ⊆ B", "B ⊇ A"],
    ["A ⊄ B", "B ⊅ A"],
    ["A ⊈ B", "B ⊉ A"],
    ["vec(x)+vec(x)", "2vec(x)"],
    ["sin^2(vec(x)*vec(y)) + cos^2(vec(x)*vec(y))", "1"],
    [
      "x+((a,b) elementof [3,sin^2(x)+cos^2(x)])^2",
      "x+((a,b) elementof [3,1])^2",
    ],
  ];

  _.each(equivalences, function (equiv) {
    var lhs = equiv[0];
    var rhs = equiv[1];
    it(lhs + " == " + rhs, function () {
      Expression.set_to_default();
      expect(
        Expression.fromText(lhs).equals(Expression.fromText(rhs)),
      ).toBeTruthy();
    });
  });

  var nonequivalences = [
    ["0.33", "1/3"],
    // ["x", "sqrt(x^2)"],
    // ['sqrt(x^2)' , 'x'],
    ["-cos(t)+3t", "-cos(t)"],
    // ["sqrt((x-3)*(x-5))", "sqrt(x-3)*sqrt(x-5)"],
    ["(19601-13861*sqrt(2))^(7/4)", "(5*sqrt(2)-7)^7"],
    ["(19601-13861*sqrt(2))^(7/4)", "(5*sqrt(2)-7)^7"],
    ["1+x", "2*x+1"],
    ["1/m", "1/n"],
    ["2/(n+1)", "1/(n+1)"],
    ["(2*n+1)/(n+2)", "1/n"],
    ["(2*n)/(n*(n+2))", "(2*n)/(n*(n+3))"],
    ["(2*log(2*x)+x)/(2*x)", "(log(2*x)+2)/(2*sqrt(x))"],
    ["2/(x+1)-1/(x+2)", "s/((s+1)*(s+2))"],
    ["1/(n-1)-1/n^2", "1/((n+1)*n)"],
    ["1/(n-1)-1/n", "1/(n-1)+1/n"],
    ["1/(x+1) + 1/(x+2)", "1/(x+1) + 2/(x+2)"],
    ["1/(x+1) + 1/(x+2)", "1/(x+3) + 1/(x+2)"],
    ["1/(x+1)-1/x", "1/(x-1)+1/x"],
    ["2*x+2", "2*x-2"],
    ["2*(x+1)", "2*x-2"],
    ["1", "(x-1)^2+1"],
    ["(t-1)^2+1", "(x-1)^2+1"],
    ["X^2+1", "x^2+1"],
    ["X", "x"], // The system SHOULD be case sensitive, to distinguish say r and R
    ["n!*n!", "(2n)!"],
    ["sin(2*pi*x)", "0"],
    ["cos((pi*x))", "(-1)^(x)"],
    ["sin(x)", "x - x^3/6 + x^5/120"],
    ["exp(x^2)", "exp(x^2 + 1)"],
    ["1000*exp(x/log(2))", "1000*exp(x/log(3))"],
    ["x", "y"],
    ["x + 2*y", "y + 2*x"],
    ["abs(x)", "x"],
    ["1E-50*sin(x)", "1E-50*cos(x)"],
    ["1-abs(x)", "1+abs(x)"],
    ["1-sqrt(x)", "1+sqrt(x)"],
    ["abs(x+1)-1", "abs(x+2)-2"],
    ["abs(x+10)-10", "abs(x+11)-11"],
    ["abs(x+100)-100", "abs(x+101)-101"],
    ["abs(x+1000)-1000", "abs(x+1001)-1001"],
    ["1/8 e^(2x) + 2e^(-2x)", "1/8 e^(2x) - 2e^(-2x)"],
    ["1/8 e^(2x) + 2e^(-2x)", "1/8 e^(2x) + 1000e^(-3x)"],
    ["1/8 e^(2x) + 2e^(-2x)", "1/8 e^(2x)"],
    ["1/8 e^(2x) + 2e^(-2x)", "1/8 e^(2x) + .00001"],
    ["1/64 e^(4x) - 1/2 + 4 e^(-4x)", "1/64 e^(4x) + 1/2 + 4 e^(-4x)"],
    ["1/64 e^(4x) - 1/2 + 4 e^(-4x)", "1/64 e^(4x) - 1/2 + 4 e^(-4x) + 1000"],
    ["1/64 e^(4x) - 1/2 + 4 e^(-4x)", "1/64 e^(4x) + 4 e^(-4x)"],
    ["e^(-10x)", "e^(-10x)+C"],
    ["e^(10x)", "e^(10x)+C"],
    ["e^(-10x)", "exp(-10x)+C"],
    ["e^(10x)", "exp(10x)+C"],
    ["e^(10x_1)", "e^(10x_1)+C"],
    ["e^(10x_1)+abs(x)", "e^(10x_1)+abs(x)+C"],
    // These three are incorrectly marked as equivalent, as finite-field checker cannot handle them
    // ['e^(10x_1)+sqrt(x)', 'e^(10x_1)+sqrt(x)+C'],
    // ['e^(10x_1)+x^0.3', 'e^(10x_1)+x^0.3+C'],
    // ['e^(10x_1)+log(x)', 'e^(10x_1)+log(x)+C'],
    ["e^(10x_1)+x^k", "e^(10x_1)+x^k+C"],
    ["e^(-10x)", "e^(-10x)+sin^2(x)+cos^2(x)"],
    ["e^(10x)", "e^(10x)+sin^2(x)+cos^2(x)"],
    ["e^(-10x)", "e^(-10x)+0.00000001"],
    ["e^(10x)", "e^(10x)+0.00000001"],
    ["e^(-10x^2)", "e^(-10x^2)+C"],
    ["e^(10x^2)", "e^(10x^2)+C"],
    ["sin(10x)", "sin(10x)+C"],
    ["cos(10x)", "cos(10x)+C"],
    ["e^(10x)+sin(10x)", "e^(10x)+sin(10x)+0.00000001"],
    ["e^(10x)+cos(10x)", "e^(10x)+cos(10x)+0.00000001"],
    ["e^(10x)+tan(10x)", "e^(10x)+tan(10x)+0.00000001"],
    ["e^(10x)+csc(10x)", "e^(10x)+csc(10x)+0.00000001"],
    ["e^(10x)+sec(10x)", "e^(10x)+sec(10x)+0.00000001"],
    ["e^(10x)+cot(10x)", "e^(10x)+cot(10x)+0.00000001"],
    ["e^(10x)=0", "e^(10x)+C=0"],
    ["e^(10x)=0", "e^(10x)+0.00000001=0"],
    ["cos(10x) < 0", "cos(10x)+C < 0"],
    ["cos(10x) < 0", "cos(10x)+0.00000001 < 0"],
    ["(e^(10x),5)", "(e^(10x)+C,5)"],
    ["(e^(10x^2),5)", "(e^(10x^2)+0.00000001,5)"],
    // ['abs(x+1E5)-1E5', 'abs(x+1E5+1)-(1E5+1)'],
    // ['abs(x+1E10)-1E10', 'abs(x+1E10+1)-(1E10+1)'],
    ["x > 1000", "x > 1001"],
    ["x + 1E-8", "x + 2E-8"],
    ["x + 1E9", "2x + 1E9"],
    ["(8-r sin(theta))r", "(8-r^2 sin(theta))"],
    ["xy^2/2 + e^y", "x + e^y"],
    ["x^(sin(x))", "x^(cos(x))"],
    ["(1,2]", "[1,2)"],
    ["sign(1)", "sign(-1)"],
    ["5q < 9z", "5q > 9z"],
    ["5q < 9z", "-5q < -9z"],
    ["5q > 9z", "-5q > -9z"],
    ["5q <= 9z", "5q >= 9z"],
    ["5q <= 9z", "-5q <= -9z"],
    ["5q >= 9z", "-5q >= -9z"],
    ["10^(-30)", "2*10^(-30)"],
    ["0", "t=4"],
    ["/4", "/4"],
    ["(f(a)-f(b))(x)", "(f(b)-f(a))(x)"],
    ["(f(a)-g(b))(x)", "(f(b)-g(a))(-x)"],
    ["(f^2(a)-f^3(b))(x)", "(f^2(b)-f^3(a))(-x)"],
    ["(f^2(a)-g^3(b))(x)", "(g^4(b)-f^2(a))(-x)"],
    ["(f_5^2(a)-g^3(b))(x)", "(g^3(b)-f_5^1(a))(-x)"],
    ["(f_2(a)-f_3(b))(x)", "(f_2(b)-f_3(a))(-x)"],
    ["(f_2(a)-g_3(b))(x)", "(g_3(b)-f_1(a))(-x)"],
    ["(f(a)-g(f))(x)", "(f(g)-g(a))(-x)"],
    ["(f^2(g)-g^3(b))(x)", "(g^2(b)-f^3(g))(-x)"],
    ["(f_2(a)-g_3(f_2))(x)", "(g_2(f_3)-f_3(a))(-x)"],
    ["(f_5^2(a)-g^3(f_5))(x)", "(g^2(f_5)-f_5^2(a))(-x)"],
    [
      "(f(a)f(b)-f(c)f(d)f(g))(g(x)g(y)-g(f))",
      "(f(c)f(d)f(g)-f(a)f(b))(g(f)-g(z)g(x))",
    ],
    [
      "(f(a)f(b)-f(c)f(d)f(g))(g(x)g(y)-g(f))",
      "(f(c)f(d)f(g)-f(a)f(b))(g(f)-g(y)f(x))",
    ],
    ["arg(1+4i)", "arg(5+19i)"],
    ["arg(x)", "arg(xy)"],
    ["arg(x)", "5*arg(x)"],
    ["f^2(x)", "f(x)^2"],
    ["∠ABC", "∠ACB"],
    ["linesegment(A,B)", "linesegment(A,C)"],
    ["$5", "5"],
    ["$x", "x"],
    ["∫_a^b xdx", "∫_(2a)^b xdx"],
    ["∫_a^b xdx", "∫_a^(2b) xdx"],
    ["∫_a^b xdx", "∫_a^b 2xdx"],
    ["∫ xdx", "∫ 2xdx"],
    ["∫ f(x)dx", "∫ g(x)dx"],
    ["A ⊂ B", "A ⊆ B"],
    ["A ⊄ B", "A ⊈ B"],
    ["A ⊃ B", "A ⊇ B"],
    ["A ⊅ B", "A ⊉ B"],
  ];

  _.each(nonequivalences, function (nonequiv) {
    var lhs = nonequiv[0];
    var rhs = nonequiv[1];
    it(lhs + " != " + rhs, function () {
      Expression.set_to_default();
      expect(
        Expression.fromText(lhs).equals(Expression.fromText(rhs)),
      ).toBeFalsy();
    });
  });

  var symbolic_equivalences = [
    ["exp(exp(exp(x)))", "exp(exp(exp(x)))"],
    ["e^(e^x)", "e^(e^x)"],
    [
      "-4*sec(4*z)^2*sin(6*z)-6*tan(4*z)*cos(6*z)",
      "-4*sec(4*z)^2*sin(6*z)-6*tan(4*z)*cos(6*z)",
    ],
    ["1/n", "1/n"],
    ["2/n", "2/n"],
    ["x^2+1", "x^2+1"],
    ["2", "2"],
    ["1/3", "1/3"],
    ["3*x^2", "3*x^2"],
    ["4*x^2", "4*x^2"],
    ["2*x-2", "2*x-2"],
    ["t*(2*x+1)", "t*(2*x+1)"],
    ["(x+2)*(x+3)", "(x+2)*(x+3)"],
    ["1/(n+1)-1/n", "1/(n+1)-1/n"],
    ["(2*x+1)/(x^2+1)-2/(x-1)", "(2*x+1)/(x^2+1)-2/(x-1)"],
    [
      "(-5/(x+3))+(16/(x+3)^2)-(2/(x+2))+4",
      "(-5/(x+3))+(16/(x+3)^2)-(2/(x+2))+4",
    ],
    ["(3*x^2-5)/((x-4)^2*x)", "(3*x^2-5)/((x-4)^2*x)"],
    ["arcsin(x)", "arcsin(x)"],
    ["arccos(x)", "arccos(x)"],
    ["arctan(x)", "arctan(x)"],
    ["arcsec(x)", "arcsec(x)"],
    ["arccsc(x)", "arccsc(x)"],
    ["arccot(x)", "arccot(x)"],
    ["arcsinh(x)", "arcsinh(x)"],
    ["arccosh(x)", "arccosh(x)"],
    ["arctanh(x)", "arctanh(x)"],
    ["arcsech(x)", "arcsech(x)"],
    ["arccsch(x)", "arccsch(x)"],
    ["arccoth(x)", "arccoth(x)"],
    ["cos^(-1)(x)", "acos(x)"],
    ["cos^(-1)(x)", "arccos(x)"],
    ["acos(x)", "arccos(x)"],
    ["cot^(-1)(x)", "acot(x)"],
    ["cot^(-1)(x)", "arccot(x)"],
    ["acot(x)", "arccot(x)"],
    ["csc^(-1)(x)", "acsc(x)"],
    ["csc^(-1)(x)", "arccsc(x)"],
    ["acsc(x)", "arccsc(x)"],
    ["sec^(-1)(x)", "asec(x)"],
    ["sec^(-1)(x)", "arcsec(x)"],
    ["asec(x)", "arcsec(x)"],
    ["sin^(-1)(x)", "asin(x)"],
    ["sin^(-1)(x)", "arcsin(x)"],
    ["asin(x)", "arcsin(x)"],
    ["tan^(-1)(x)", "atan(x)"],
    ["tan^(-1)(x)", "arctan(x)"],
    ["atan(x)", "arctan(x)"],
    ["cosh^(-1)(x)", "acosh(x)"],
    ["cosh^(-1)(x)", "arccosh(x)"],
    ["acosh(x)", "arccosh(x)"],
    ["coth^(-1)(x)", "acoth(x)"],
    ["coth^(-1)(x)", "arccoth(x)"],
    ["acoth(x)", "arccoth(x)"],
    ["csch^(-1)(x)", "acsch(x)"],
    ["csch^(-1)(x)", "arccsch(x)"],
    ["acsch(x)", "arccsch(x)"],
    ["sech^(-1)(x)", "asech(x)"],
    ["sech^(-1)(x)", "arcsech(x)"],
    ["asech(x)", "arcsech(x)"],
    ["sinh^(-1)(x)", "asinh(x)"],
    ["sinh^(-1)(x)", "arcsinh(x)"],
    ["asinh(x)", "arcsinh(x)"],
    ["tanh^(-1)(x)", "atanh(x)"],
    ["tanh^(-1)(x)", "arctanh(x)"],
    ["atanh(x)", "arctanh(x)"],
    ["sin^2(x)", "sin(x)^2"],
    ["sin^2 x ", "sin(x)^2"],
    ["sin^n(x)", "sin(x)^n"],
    ["sin^n x ", "sin(x)^n"],
    ["sinh^2(x)", "sinh(x)^2"],
    ["sinh^2 x ", "sinh(x)^2"],
    ["sinh^n(x)", "sinh(x)^n"],
    ["sinh^n x ", "sinh(x)^n"],
    ["cos^2(x)", "cos(x)^2"],
    ["cos^2 x ", "cos(x)^2"],
    ["cos^n(x)", "cos(x)^n"],
    ["cos^n x ", "cos(x)^n"],
    ["cosh^2(x)", "cosh(x)^2"],
    ["cosh^2 x ", "cosh(x)^2"],
    ["cosh^n(x)", "cosh(x)^n"],
    ["cosh^n x ", "cosh(x)^n"],
    ["tan^2(x)", "tan(x)^2"],
    ["tan^2 x ", "tan(x)^2"],
    ["tan^n(x)", "tan(x)^n"],
    ["tan^n x ", "tan(x)^n"],
    ["tanh^2(x)", "tanh(x)^2"],
    ["tanh^2 x ", "tanh(x)^2"],
    ["tanh^n(x)", "tanh(x)^n"],
    ["tanh^n x ", "tanh(x)^n"],
    ["sec^2(x)", "sec(x)^2"],
    ["sec^2 x ", "sec(x)^2"],
    ["sec^n(x)", "sec(x)^n"],
    ["sec^n x ", "sec(x)^n"],
    ["sech^2(x)", "sech(x)^2"],
    ["sech^2 x ", "sech(x)^2"],
    ["sech^n(x)", "sech(x)^n"],
    ["sech^n x ", "sech(x)^n"],
    ["csc^2(x)", "csc(x)^2"],
    ["csc^2 x ", "csc(x)^2"],
    ["csc^n(x)", "csc(x)^n"],
    ["csc^n x ", "csc(x)^n"],
    ["csch^2(x)", "csch(x)^2"],
    ["csch^2 x ", "csch(x)^2"],
    ["csch^n(x)", "csch(x)^n"],
    ["csch^n x ", "csch(x)^n"],
    ["cot^2(x)", "cot(x)^2"],
    ["cot^2 x ", "cot(x)^2"],
    ["cot^n(x)", "cot(x)^n"],
    ["cot^n x ", "cot(x)^n"],
    ["coth^2(x)", "coth(x)^2"],
    ["coth^2 x ", "coth(x)^2"],
    ["coth^n(x)", "coth(x)^n"],
    ["coth^n x ", "coth(x)^n"],
    ["log^2 x ", "log(x)^2"],
    ["ln^2 x ", "ln(x)^2"],
    ["log^n x ", "log(x)^n"],
    ["ln^n x ", "ln(x)^n"],
    ["1", "1"],
    ["sqrt(10000 - x)", "sqrt(10000 - x)"],
    ["exp(x^y)", "exp(x^y)"],
    ["2+", "2+"],
    ["(f(a)-f(b))(x)", "(f(a)-f(b))(x)"],
    ["exp(x)", "e^(x)"],
    ["log(x)", "ln(x)"],
    ["f'(x)", "f(x)'"],
    ["f''(x)", "f(x)''"],
    ["f'''(x)", "f(x)'''"],
    ["x+-y", "x-y"],
    ["∠ABC", "∠CBA"],
    ["∠ABC + ∠DEF", "∠CBA + ∠FED"],
    ["linesegment(A,B)", "linesegment(B,A)"],
    [
      "linesegment(A,B) + linesegment(C,D)",
      "linesegment(B,A) + linesegment(D,C)",
    ],
  ];

  _.each(symbolic_equivalences, function (equiv) {
    var lhs = equiv[0];
    var rhs = equiv[1];
    it(lhs + " symbolic == " + rhs, function () {
      Expression.set_to_default();
      expect(
        Expression.fromText(lhs).equalsViaSyntax(Expression.fromText(rhs)),
      ).toBeTruthy();
    });
  });

  var symbolic_nonequivalences = [
    ["3+2", "5"],
    ["-2 sin(t^2)/t", "-2 t sin(t^2)/t^2"],
    ["-2t sin(t^2)/t^2 + 3t^2 sin(t^3)/t^3", "-2 sin(t^2)/t + 3 sin(t^3)/t"],
    ["sin(t^2)*t/t", "sin(t^2)"],
    ["(1/3)g^3", "(g^3)/(3)"],
    ["x*log(3)", "log(3^x)"],
    ["e^(e^x+x/x)", "e^(e^x+1)"],
    ["1/sqrt(4)", "1/2"],
    ["4^(-1/2)", "1/2"],
    ["0.5", "1/2"], // 'Mix of floats and rational numbers'
    ["x^(1/2)", "sqrt(x)"],
    ["1/sqrt(x)", "sqrt(1/x)"],
    ["x-1", "(x^2-1)/(x+1)"],
    ["a^b * a^c", "a^(b+c)"],
    ["2+2*sqrt(3+x)", "2+sqrt(12+4*x)"],
    ["1/n-1/(n+1)", "1/(n*(n+1))"],
    ["0.5*x^2+3*x-1", "x^2/2+3*x-1"],
    ["cos(x)", "cos(-x)"],
    ["cos(x)^2+sin(x)^2", "1"],
    ["cos^2 x+sin^2 x", "1"],
    ["tan^2 x", "(tan x)(tan(x))"],
    ["2*cos(x)^2-1", "cos(2*x)"],
    ["2*cos(2*x)+x+1", "-sin(x)^2+3*cos(x)^2+x"],
    ["log(a^2*b)", "2*log(a)+log(b)"],
    ["sqrt(12)", "2*sqrt(3)"],
    ["sqrt(11+6*sqrt(2))", "3+sqrt(2)"],
    ["sqrt(2*log(26)+4-2*log(2))", "sqrt(2*log(13)+4)"],
    ["1+2*x", "x*2+1"],
    ["(x+y)+z", "z+x+y"],
    ["(x+5)*x", "x*(5+x)"],
    ["x*x", "x^2"],
    ["(1-x)^2", "(x-1)^2"],
    ["x*(x+5)", "5*x+x^2"],
    ["1+x+x", "2*x+1"],
    ["2^2", "4"],
    ["a^2/b^3", "a^2*b^(-3)"],
    ["x^(1/2)", "sqrt(x)"],
    ["x-1", "(x^2-1)/(x+1)"],
    ["x+x", "2*x"],
    ["x+x^2", "x^2+x"],
    ["(x-1)^2", "x^2-2*x+1"],
    ["(x-1)^(-2)", "1/(x^2-2*x+1)"],
    ["1/n-1/(n+1)", "1/(n*(n+1))"],
    ["(1/2)/(3/4)", "2/3"],
    ["a+1/2", "(2*a+1)/2"],
    ["1/n +2/(n+1)", "(3*n+1)/(n*(n+1))"],
    ["2*(1/n)", "2/n"],
    ["(x-1)/(x^2-1)", "1/(x+1)"],
    ["(x-2)/4/(2/x^2)", "(x-2)*x^2/8"],
    ["1/(1-1/x)", "x/(x-1)"],
    ["(-1)^n*cos(x)^n", "(-cos(x))^n"],
    ["log(abs((x^2-9)))", "log(abs(x-3))+log(abs(x+3))"],
    ["log(exp(x))", "x"],
    ["exp(log(x))", "x"],
    ["(x-1)^2", "x^2-2*x+1"],
    ["(x-1)*(x^2+x+1)", "x^3-1"],
    ["(x-1)^(-2)", "1/(x^2-2*x+1)"],
    ["2/4", "1/2"],
    ["2^3", "8"],
    ["3^2", "9"],
    ["sqrt(3)", "3^(1/2)"],
    ["2*sqrt(2)", "sqrt(8)"],
    ["2*2^(1/2)", "sqrt(8)"],
    ["4^(1/2)", "2"],
    ["sqrt(3)/3", "(1/3)^(1/2)"],
    ["sqrt(2)/4", "1/sqrt(8)"],
    ["1/3^(1/2)", "(1/3)^(1/2)"],
    ["1/sqrt(2)", "2^(1/2)/2"],
    ["a^2/b^3", "a^2*b^(-3)"],
    ["-1+2", "2-1"],
    ["-1*2+3*4", "3*4-1*2"],
    ["-1*2+3*4", "3*4-1*2"],
    ["(-1*2)+3*4", "10"],
    ["x*(-y)", "-x*y"],
    ["x*(-y)", "-(x*y)"],
    ["(-x)*(-x)", "x*x"],
    ["(-x)*(-x)", "x^2"],
    ["1/2", "3/6"],
    ["1/(1+2*x)", "1/(2*x+1)"],
    ["2/(4+2*x)", "1/(x+2)"],
    ["(a*b)/c", "a*(b/c)"],
    ["(-x)/y", "-(x/y)"],
    ["x/(-y)", "-(x/y)"],
    ["-1/(1-x)", "1/(x-1)"],
    ["1/2*1/x", "1/(2*x)"],
    ["2*(x-1)", "2*x-2"],
    ["2*(x+1)", "2*x+2"],
    ["2*(x+0.5)", "2*x+1"],
    ["t*x+t", "t*(x+1)"],
    ["2*x*(x-3)", "2*x^2-6*x"],
    ["2*(x^2-3*x)", "2*x*(x-3)"],
    ["x*(2*x-6)", "2*x*(x-3)"],
    ["(x+2)*(2*x+6)", "2*(x+2)*(x+3)"],
    ["(z*x+z)*(2*x+6)", "2*z*(x+1)*(x+3)"],
    ["(x+t)*(x-t)", "x^2-t^2"],
    ["t^2-1", "(t-1)*(t+1)"],
    ["(2-x)*(3-x)", "(x-2)*(x-3)"],
    ["(1-x)^2", "(x-1)^2"],
    ["-(1-x)^2", "-(x-1)^2"],
    ["4*(1-x/2)^2", "(x-2)^2"],
    ["(x-1)*(x^2+x+1)", "x^3-1"],
    ["7*x^3-7*x+7", "7*(x^3-x+1)"],
    ["(1-x)*(2-x)*(3-x)", "-x^3+6*x^2-11*x+6"],
    ["(2-x)*(2-x)*(3-x)", "-x^3+7*x^2-16*x+12"],
    ["(2-x)^2*(3-x)", "-x^3+7*x^2-16*x+12"],
    ["(x^2-4*x+4)*(3-x)", "-x^3+7*x^2-16*x+12"],
    ["(x^2-3*x+2)*(3-x)", "-x^3+6*x^2-11*x+6"],
    ["3*y^3-6*y^2-24*y", "3*(y-4)*y*(y+2)"],
    ["3*(y^3-2*y^2-8*y)", "3*(y-4)*y*(y+2)"],
    ["3*y*(y^2-2*y-8)", "3*(y-4)*y*(y+2)"],
    ["3*(y^2-4*y)*(y+2)", "3*(y-4)*y*(y+2)"],
    ["(y-4)*y*(3*y+6)", "3*(y-4)*y*(y+2)"],
    ["24*(x-1/4)", "24*x-6"],
    ["(x-sqrt(2))*(x+sqrt(2))", "x^2-2"],
    ["1/(n+1)+1/(1-n)", "1/(n+1)-1/(n-1)"],
    ["1/(2*(n-1))-1/(2*(n+1))", "1/((n-1)*(n+1))"],
    ["1/(x-1)-(x+1)/(x^2+1)", "2/((x-1)*(x^2+1))"],
    ["1/(2*x-2)-(x+1)/(2*(x^2+1))", "1/((x-1)*(x^2+1))"],
    ["3/(x+1) + 3/(x+2)", "3*(2*x+3)/((x+1)*(x+2))"],
    ["3*(1/(x+1) + 1/(x+2))", "3*(2*x+3)/((x+1)*(x+2))"],
    ["3*x*(1/(x+1) + 2/(x+2))", "-12/(x+2)-3/(x+1)+9"],
    ["2*x+1/(x+1)+1/(x-1)", "2*x^3/(x^2-1)"],
    ["(cos(t)-sqrt(2))^2", "cos(t)^2-2*sqrt(2)*cos(t)+2"],
    ["(n+1)*n!", "(n+1)!"],
    ["n/n!", "1/(n-1)!"],
    ["(n!)^2", "n! * n!"],
    ["abs((-x)^(1/3))", "(abs(-x))^(1/3)"],
    ["log(x^2*y/z)", "log(x^2*y) - log(z)"],
    ["log(x^2*y/z)", "log(x^2) + log(y) - log(z)"],
    ["log(x^2*y/z)", "2*log(x) + log(y) - log(z)"],
    ["log(x^2*y/exp(1))", "2*log(x) + log(y) - 1"],
    ["log(sqrt(x^2 + 9) + x) - log(3)", "(asinh(x/3))"],
    ["sin(x + y)", "sin(x)*cos(y) + cos(x)*sin(y)"],
    ["cos(x + y)", "cos(x)*cos(y) - sin(x)*sin(y)"],
    ["log(x)/8", "0.125*log(x)"],
    ["log(x)/8", "(1/8)*log(x)"],
    ["(1/8)*log(x)", "0.125*log(x)"],
    ["x*log(y)", "log(y^x)"],
    ["(exp(x))^y", "exp(x*y)"],
    ["0*x", "0*y"],
    ["oo", "+oo"],
    ["-2 cos(t)^2 sin(t)", "-cos t sin(2 t)"],
    ["(2x,y^2)", "(x+x, y*y)"],
    ["(2x,y^2]", "(x+x,y*y]"],
    ["[2x,y^2)", "[x+x,y*y)"],
    ["[2x,y^2]", "[x+x,y*y]"],
    ["arcsin(1/2)", "pi/6"],
    ["sqrt(e)", "e^(1/2)"],
    ["sin(pi)", "0"],
    ["cos(pi)", "-1"],
    ["sin(pi/2)", "1"],
    ["cos(pi/2)", "0"],
    ["5x + 2y = 3", "6-4y = 10x"],
    ["5x + 2y = 3", "-(6-4y) = -10x"],
    ["5q-9z < 2u+9z", "27z -5q > -4u + 5q-9z"],
    ["5q-9z > 2u+9z", "27z -5q < -4u + 5q-9z"],
    ["5q-9z <= 2u+9z", "27z -5q >= -4u + 5q-9z"],
    ["5q-9z >= 2u+9z", "27z -5q <= -4u + 5q-9z"],
    ["(k+1)y_t", "k*y_t + y_t"],
    ["5C^(4+)-2C^(4+)", "3C^(4+)"],
    ["5C_(4+)-2C_(4+)", "3C_(4+)"],
    ["re(3-5i)", "3"],
    ["im(3-5i)", "-5"],
    ["(f(a)-f(b))(x)", "(f(b)-f(a))(-x)"],
    ["(f(a)-g(b))(x)", "(g(b)-f(a))(-x)"],
    ["(f^2(a)-f^3(b))(x)", "(f^3(b)-f^2(a))(-x)"],
    ["(f^2(a)-g^3(b))(x)", "(g^3(b)-f^2(a))(-x)"],
    ["(f_5^2(a)-g^3(b))(x)", "(g^3(b)-f_5^2(a))(-x)"],
    ["(f_2(a)-f_3(b))(x)", "(f_3(b)-f_2(a))(-x)"],
    ["(f_2(a)-g_3(b))(x)", "(g_3(b)-f_2(a))(-x)"],
    ["(f(a)-g(f))(x)", "(g(f)-f(a))(-x)"],
    ["(f^2(g)-g^3(b))(x)", "(g^3(b)-f^2(g))(-x)"],
    ["(f_2(a)-g_3(f_2))(x)", "(g_3(f_2)-f_2(a))(-x)"],
    ["(f_5^2(a)-g^3(f_5))(x)", "(g^3(f_5)-f_5^2(a))(-x)"],
    [
      "(f(a)f(b)-f(c)f(d)f(g))(g(x)g(y)-g(f))",
      "(f(c)f(d)f(g)-f(a)f(b))(g(f)-g(y)g(x))",
    ],
    ["arg(1+4i)", "arg(5+20i)"],
    ["arg(x)", "arg(5x)"],
    ["log_10(100000)", "5"],
    ["log_2(8)", "3"],
    ["log_a(b)", "log(b)/log(a)"],
    ["+2", "2"],
    ["++2", "2"],
    ["+x", "x"],
    ["++x", "x"],
    ["x++y", "x+y"],
    ["x(+y)", "xy"],
    ["x(++y)", "xy"],
    ["x++-y", "x-y"],
    ["x++--y", "x+y"],
    ["x--y", "x+y"],
    ["∠ABC", "∠ACB"],
    ["linesegment(A,B)", "linesegment(A,C)"],
    ["50%", "1/2"],
    ["180 deg", "pi"],
    ["x ∈ A", "A ∋ x"],
    ["x ∉ A", "A ∌ x"],
    ["A ⊂ B", "B ⊃ A"],
    ["A ⊆ B", "B ⊇ A"],
    ["A ⊄ B", "B ⊅ A"],
    ["A ⊈ B", "B ⊉ A"],
  ];

  _.each(symbolic_nonequivalences, function (nonequiv) {
    var lhs = nonequiv[0];
    var rhs = nonequiv[1];
    it(lhs + " symbolic != " + rhs, function () {
      Expression.set_to_default();
      expect(
        Expression.fromText(lhs).equalsViaSyntax(Expression.fromText(rhs)),
      ).toBeFalsy();
    });
  });

  const symbolic_equivalent_asts = [
    [["-", 3], -3],
    [
      ["-", ["*", 3, "x"]],
      ["*", -3, "x"],
    ],
    [
      ["+", 5, ["-", 3]],
      ["+", 5, -3],
    ],
    [
      ["+", 5, ["-", ["*", 3, "x"]]],
      ["+", 5, ["*", -3, "x"]],
    ],
  ];

  _.each(symbolic_equivalent_asts, function (equiv) {
    var lhs = equiv[0];
    var rhs = equiv[1];
    it(lhs + " symbolic == " + rhs, function () {
      Expression.set_to_default();
      expect(
        Expression.fromAst(lhs).equalsViaSyntax(Expression.fromAst(rhs)),
      ).toBeTruthy();
    });
  });

  const symbolic_nonequivalent_asts = [
    [["-", -3], 3],
    [["-", ["-", 3]], 3],
    [
      ["-", ["*", -3, "x"]],
      ["*", 3, "x"],
    ],
    [
      ["-", ["*", ["-", 3], "x"]],
      ["*", 3, "x"],
    ],
    [
      ["+", 5, ["-", -3]],
      ["+", 5, 3],
    ],
    [
      ["+", 5, ["-", ["*", -3, "x"]]],
      ["+", 5, ["*", 3, "x"]],
    ],
  ];

  _.each(symbolic_nonequivalent_asts, function (equiv) {
    var lhs = equiv[0];
    var rhs = equiv[1];
    it(lhs + " symbolic != " + rhs, function () {
      Expression.set_to_default();
      expect(
        Expression.fromAst(lhs).equalsViaSyntax(Expression.fromAst(rhs)),
      ).toBeFalsy();
    });
  });

  it("allow blanks", function () {
    var expr1 = Expression.fromText("/4");
    var expr2 = Expression.fromText("/4");

    expect(expr1.equals(expr2)).toBeFalsy();
    expect(expr1.equals(expr2, { allow_blanks: true })).toBeTruthy();

    var expr1 = Expression.fromText("_6^14C");
    var expr2 = Expression.fromText("_6^14C");

    expect(expr1.equals(expr2)).toBeFalsy();
    expect(expr1.equals(expr2, { allow_blanks: true })).toBeTruthy();
  });

  it("integer assumption", function () {
    Expression.set_to_default();

    var expr1 = Expression.from("(-1)^n * (-1)^n");
    var expr2 = Expression.from("1");

    expect(expr1.equals(expr2)).toBeFalsy();

    Expression.clear_assumptions();
    Expression.add_assumption(Expression.from("n ∈ Z"));
    expect(expr1.equals(expr2)).toBeTruthy();

    Expression.clear_assumptions();
    Expression.add_assumption(Expression.from("Z ∋ n"));
    expect(expr1.equals(expr2)).toBeTruthy();

    Expression.clear_assumptions();
    Expression.add_assumption(Expression.from("x ∈ Z"));
    expect(expr1.equals(expr2)).toBeFalsy();

    Expression.clear_assumptions();
    Expression.add_assumption(Expression.from("n ∈ R"));
    expect(expr1.equals(expr2)).toBeFalsy();

    Expression.clear_assumptions();
    Expression.add_assumption(Expression.from("n ∈ Z and 3*x+5 > 3"));
    expect(expr1.equals(expr2)).toBeTruthy();

    Expression.clear_assumptions();
    Expression.add_assumption(Expression.from("n ∈ Z or 3*x+5 > 3"));
    expect(expr1.equals(expr2)).toBeFalsy();

    Expression.clear_assumptions();
  });

  it("stringify and revive", function () {
    Expression.set_to_default();

    var expr1 = Expression.fromText("sin(x)");
    var copy1 = JSON.parse(JSON.stringify(expr1), Expression.reviver);

    expect(expr1.equals(copy1)).toBeTruthy();
    expect(copy1.equals(expr1)).toBeTruthy();

    let obj2 = { expr: expr1, other: { a: 1, b: "hi" } };
    let copy2 = JSON.parse(JSON.stringify(obj2), Expression.reviver);
    expect(obj2.other).toEqual(copy2.other);
    expect(copy2.expr.equals(expr1)).toBeTruthy();
  });

  it("tuples, vectors, intervals, altvectors", function () {
    let tuple = Expression.fromLatex("(a,b)");
    let vector = Expression.fromLatex("(a,b)").tuples_to_vectors();
    let altvector = Expression.fromLatex("\\langle a, b \\rangle");
    let interval = Expression.fromLatex("(a,b)").to_intervals();

    expect(tuple.equals(vector)).toBeTruthy();
    expect(tuple.equals(vector, { coerce_tuples_arrays: false })).toBeFalsy();
    expect(tuple.equals(altvector)).toBeTruthy();
    expect(
      tuple.equals(altvector, { coerce_tuples_arrays: false }),
    ).toBeFalsy();
    expect(tuple.equals(interval)).toBeTruthy();
    expect(tuple.equals(interval, { coerce_tuples_arrays: false })).toBeFalsy();
    expect(vector.equals(altvector)).toBeTruthy();
    expect(vector.equals(altvector, { coerce_vectors: false })).toBeFalsy();
    expect(vector.equals(interval)).toBeFalsy();
    expect(altvector.equals(interval)).toBeFalsy();
    expect(vector.equals(altvector.altvectors_to_vectors())).toBeTruthy();
    expect(
      vector.equals(altvector.altvectors_to_vectors(), {
        coerce_vectors: false,
      }),
    ).toBeTruthy();
    expect(interval.equals(altvector).altvectors_to_vectors).toBeFalsy();
  });

  it("arrays, intervals", function () {
    let array = Expression.fromLatex("[a,b]");
    let interval = Expression.fromLatex("[a,b]").to_intervals();

    expect(array.equals(interval)).toBeTruthy();
    expect(array.equals(interval, { coerce_tuples_arrays: false })).toBeFalsy();
  });

  it("unions of tuples, vectors, intervals, altvectors, arrays", function () {
    let t1 = Expression.fromLaTeX("(1,2)");
    let t1a = Expression.fromLatex("(\\sin^2(x)+\\cos^2(x),2)");
    let v1 = t1.tuples_to_vectors().tree;
    let v1a = t1a.tuples_to_vectors().tree;
    let oi1 = t1.to_intervals().tree;
    let oi1a = t1a.to_intervals().tree;
    t1 = t1.tree;
    t1a = t1a.tree;
    let av1 = Expression.fromLaTeX("\\langle 1,2 \\rangle").tree;

    let a2 = Expression.fromLaTeX("[3,4]");
    let ci2 = a2.to_intervals().tree;
    a2 = a2.tree;

    let tvav1 = [t1, t1a, v1, v1a, av1];
    let ao2 = [a2, ci2];

    for (let [i11, op11] of tvav1.entries()) {
      for (let [i12, op12] of ao2.entries()) {
        for (let op21 of tvav1.slice(i11 + 1)) {
          for (let op22 of ao2.slice(i12 + 1)) {
            expect(
              Expression.fromAst(["union", op11, op12]).equals(
                Expression.fromAst(["union", op21, op22]),
              ),
            ).toBeTruthy();
          }
        }
      }
    }

    let to1 = [t1, t1a, oi1, oi1a];

    for (let [i11, op11] of to1.entries()) {
      for (let [i12, op12] of ao2.entries()) {
        for (let op21 of to1.slice(i11 + 1)) {
          for (let op22 of ao2.slice(i12 + 1)) {
            expect(
              Expression.fromAst(["union", op11, op12]).equals(
                Expression.fromAst(["union", op21, op22]),
              ),
            ).toBeTruthy();
          }
        }
      }
    }
  });

  var matchDerivatives = [
    ["x^3/3+c", "x^3/3+c"],
    ["x^2/2-2*x+2+c", "(x-2)^2/2+k"],
    ["exp(x)+c", "exp(x)"],
    ["ln(x)+c", "ln(x)+c"],
    ["ln(k*x)", "ln(x)+c"],
    ["ln(abs(x))+c", "ln(abs(x))+c"],
    ["ln(k*abs(x))", "ln(abs(x))+c"],
    ["ln(abs(k*x))", "ln(abs(x))+c"],
    ["ln(abs(x))+c", "ln(k*abs(x))"],
    ["ln(k*abs(x))", "ln(k*abs(x))"],
    ["c-(log(2)-log(x))^2/2", "-1/2*log(2/x)^2"],
    ["2*sin(x)*cos(x)+k", "sin(2*x)+c"],
    ["-2*cos(3*x)/3-3*cos(2*x)/2+c", "-2*cos(3*x)/3-3*cos(2*x)/2+c"],
    [
      "(tan(2*x)-2*x)/2+c",
      "-(x*sin(4*x)^2-sin(4*x)+x*cos(4*x)^2+2*x*cos(4*x)+x)/(sin(4*x)^2+cos(4*x)^2+2*cos(4*x)+1)",
    ],
    ["tan(x)-x+c", "tan(x)-x"],
    [
      "2*(sqrt(x)-5)-10*log((sqrt(x)-5))+c",
      "2*(sqrt(x)-5)-10*log((sqrt(x)-5))+c",
    ],
    ["x^3/3+c", "x^3/3"],
    ["x^3/3+c+1", "x^3/3"],
    ["x^3/3+3*c", "x^3/3"],
    ["x^3/3-c", "x^3/3"],
    ["x^2/2-2*x+2+c", "(x-2)^2/2"],
    ["(x-1)^5/5+c", "(x-1)^5/5"],
    ["cos(2*x)/2+1+c", "cos(2*x)/2"],
    //'exp(x^y)' , 'exp(x^y + 1)'],
  ];

  _.each(matchDerivatives, function (deriv) {
    var lhs = deriv[0];
    var rhs = deriv[1];
    it("(d/dx) " + lhs + " == " + "(d/dx) " + rhs, function () {
      Expression.set_to_default();
      expect(
        Expression.fromText(lhs)
          .derivative("x")
          .equals(Expression.fromText(rhs).derivative("x")),
      ).toBeTruthy();
    });
  });

  var derivatives = [
    ["x^2", "2x"],
    ["x^3", "3x^2"],
    ["sin x", "cos x"],
    ["cos x", "-sin x"],
    ["sin^2 x", "2 sin x cos x"],
  ];

  _.each(derivatives, function (deriv) {
    var lhs = deriv[0];
    var rhs = deriv[1];
    it("(d/dx) " + lhs + " == " + rhs, function () {
      Expression.set_to_default();
      expect(
        Expression.fromText(lhs)
          .normalize_applied_functions()
          .derivative("x")
          .equals(Expression.fromText(rhs).normalize_applied_functions()),
      ).toBeTruthy();
    });
  });

  var dontMatchDerivatives = [
    ["exp(x)", "exp(x)"],
    ["2*x", "x^3/3"],
    ["2*x+c", "x^3/3"],
    ["ln(x)", "ln(x)"],
    ["ln(x)", "ln(abs(x))+c"],
    ["ln(x)+c", "ln(abs(x))+c"],
    ["ln(abs(x))", "ln(abs(x))+c"],
    ["ln(k*x)", "ln(abs(x))+c"],
    ["ln(x)", "ln(k*abs(x))"],
    ["ln(x)+c", "ln(k*abs(x))"],
    ["ln(abs(x))", "ln(k*abs(x))"],
    ["ln(k*x)", "ln(k*abs(x))"],
    ["ln(x)+ln(a)", "ln(k*abs(x+a))"],
    ["log(x)^2-2*log(c)*log(x)+k", "ln(c/x)^2"],
    ["log(x)^2-2*log(c)*log(x)+k", "ln(abs(c/x))^2"],

    ["2*sin(x)*cos(x)", "sin(2*x)+c"],
    ["-2*cos(3*x)/3-3*cos(2*x)/2", "-2*cos(3*x)/3-3*cos(2*x)/2+c"],
    ["-2*cos(3*x)/3-3*cos(2*x)/2+1", "-2*cos(3*x)/3-3*cos(2*x)/2+c"],
    [
      "(tan(2*t)-2*t)/2",
      "-(t*sin(4*t)^2-sin(4*t)+t*cos(4*t)^2+2*t*cos(4*t)+t)/(sin(4*t)^2+cos(4*t)^2+2*cos(4*t)+1)",
    ],
    [
      "(tan(2*t)-2*t)/2+1",
      "-(t*sin(4*t)^2-sin(4*t)+t*cos(4*t)^2+2*t*cos(4*t)+t)/(sin(4*t)^2+cos(4*t)^2+2*cos(4*t)+1)",
    ],
  ];

  var matchForm = [
    ["x^2+y/z", "a^2+c/b"],
    ["x^2+y", "a^2+b"],
    ["x^2+1", "x^3+1"],
  ];
});
