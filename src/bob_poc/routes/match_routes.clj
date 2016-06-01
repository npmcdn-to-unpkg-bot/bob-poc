(ns bob-poc.routes.match-routes
  (:require [compojure.core :refer [defroutes context GET POST]]
            [clojure.tools.logging :refer [debug]]
            [bob-poc.match.match-service :as match]
            [ring.util.http-response :refer [ok]]
            [bob-poc.match.match-handler :refer [match-ws-handler]]))

(defroutes match-routes
  (context "/v1" []
    (GET "/match-ws" [] match-ws-handler)

    (GET "/current-match" []
      (debug "Requesting current match...")
      (ok (match/get-current-match)))))
