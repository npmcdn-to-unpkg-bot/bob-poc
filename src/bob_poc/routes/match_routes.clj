(ns bob-poc.routes.match-routes
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [clojure.tools.logging :refer [debug]]
            [bob-poc.match.match-service :as match]))

(defroutes match-routes
  (context "/v1" []
    (GET "/match" []
      (debug "Requesting current match...")
      (ok (match/get-current-match)))

    (POST "/vote" {vote :params}
      (debug "Vote received" vote)
      (ok (match/vote! (:id vote))))))
