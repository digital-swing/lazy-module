import "@testing-library/jest-dom"; // default for Jest
import "@testing-library/jest-dom/vitest"; // for Vitest

import * as matchers from "jest-extended";

expect.extend(matchers);
