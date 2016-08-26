(ns bob-poc.match.data-spec
  (:require [speclj.core :refer :all]
            [bob-poc.match.match-service :as match-service]
            [bob-poc.application.data :as data]))

(defn insert-test-bands []
  (data/add-new-song! "testband1" "bandimage1.jpg" "http://blaablaablaa1")
  (data/add-new-song! "testband2" "bandimage2.jpg" "http://blaablaablaa2"))

(describe "data handling"
  (before (match-service/reset-all-data!))

  (it "should return empty array when no bands available"
    (should (empty? (data/get-bands))))

  (it "should return correct bands when bands are available"
    (insert-test-bands)
    (should= [] (data/get-bands))))