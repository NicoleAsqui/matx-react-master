import Mock from "./mock";

import "./db/auth";
import "./db/ecommerce";
import "./db/inventory";
import "./db/movements";
import "./db/alerts";
import "./db/notification";

Mock.onAny().passThrough();
